using AutoMapper;
using EPPP_INVENTARIO_API.Constants;
using EPPP_INVENTARIO_API.Models;
using EPPP_INVENTARIO_API.Models.Dtos.Producto;
using EPPP_INVENTARIO_API.Repository.IRepository;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;

namespace EPPP_INVENTARIO_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [EnableCors(PolicyNames.AllowSpecificOrigin)]
    public class ProductosController : ControllerBase
    {
        private readonly IProductoRepository _productoRepository;
        private readonly ICategoriaRepository _categoriaRepository;
        private readonly IMapper _mapper;

        public ProductosController(IProductoRepository productoRepository, ICategoriaRepository categoriaRepository, IMapper mapper)
        {
            _productoRepository = productoRepository;
            _categoriaRepository = categoriaRepository;
            _mapper = mapper;
        }

        // Obtener productos
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public IActionResult GetProductos()
        {
            var productos = _productoRepository.GetProductos();
            var productosDto = new List<ProductoDto>();
            foreach (var producto in productos)
            {
                productosDto.Add(_mapper.Map<ProductoDto>(producto));
            }
            return Ok(productosDto);
        }

        // Obtener producto por id
        [HttpGet("{id:int}", Name = "GetProductById")]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public IActionResult GetProductById(int id)
        {
            var producto = _productoRepository.GetProducto(id);
            if (producto == null)
            {
                return NotFound($"El producto con el id {id} no existe");
            }

            var productoDto = _mapper.Map<ProductoDto>(producto);
            return Ok(productoDto);
        }

        // Buscar productos por nombre, código, descripción o marca
        [HttpGet("Buscar", Name = "SearchProductos")]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public IActionResult SearchProductos([FromQuery] string search = "")
        {
            var productos = _productoRepository.GetProductoBySearch(search);
            var productosDto = new List<ProductoDto>();
            foreach (var producto in productos)
            {
                productosDto.Add(_mapper.Map<ProductoDto>(producto));
            }
            return Ok(productosDto);
        }

        // Crear producto
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public IActionResult CreateProducto([FromBody] CreateProductoDto createProductoDto)
        {
            if (createProductoDto == null || !ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (!_categoriaRepository.CategoriaExists(createProductoDto.CategoriaId))
            {
                ModelState.AddModelError("CustomError", $"La categoria con el id {createProductoDto.CategoriaId} no existe");
                return BadRequest(ModelState);
            }

            if (_productoRepository.ProductoExists(createProductoDto.Codigo))
            {
                ModelState.AddModelError("CustomError", $"Ya existe un producto con el código {createProductoDto.Codigo}");
                return BadRequest(ModelState);
            }

            var producto = _mapper.Map<Producto>(createProductoDto);
            if (!_productoRepository.CreateProducto(producto))
            {
                ModelState.AddModelError("CustomError", $"Algo salió mal al guardar el registro {producto.Nombre}");
                return StatusCode(500, ModelState);
            }

            var productoDto = _mapper.Map<ProductoDto>(_productoRepository.GetProducto(producto.ProductoId));
            return CreatedAtRoute("GetProductById", new { id = producto.ProductoId }, productoDto);
        }

        // Editar producto
        [HttpPatch("{id:int}", Name = "UpdateProducto")]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public IActionResult UpdateProducto(int id, [FromBody] UpdateProductoDto updateProductoDto)
        {
            if (updateProductoDto == null || !ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var producto = _productoRepository.GetProducto(id);
            if (producto == null)
            {
                return NotFound($"El producto con el id {id} no existe");
            }

            if (!_categoriaRepository.CategoriaExists(updateProductoDto.CategoriaId))
            {
                ModelState.AddModelError("CustomError", $"La categoria con el id {updateProductoDto.CategoriaId} no existe");
                return BadRequest(ModelState);
            }

            if (_productoRepository.ProductoExists(updateProductoDto.Codigo, id))
            {
                ModelState.AddModelError("CustomError", $"Ya existe otro producto con el código {updateProductoDto.Codigo}");
                return BadRequest(ModelState);
            }

            // Se mapea sobre la entidad existente para conservar el id y la fecha de creación
            // Nota: no se anula la navegación Categoria; en EF Core eso rompe la relación requerida y elimina el producto
            _mapper.Map(updateProductoDto, producto);
            if (!_productoRepository.UpdateProducto(producto))
            {
                ModelState.AddModelError("CustomError", $"Algo salió mal al actualizar el registro {producto.Nombre}");
                return StatusCode(500, ModelState);
            }

            return NoContent();
        }

        // Actualizar stock (entrada / salida) desde el microservicio de movimientos
        [HttpPatch("{id:int}/Stock", Name = "UpdateStockProducto")]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public IActionResult UpdateStockProducto(int id, [FromBody] UpdateStockDto updateStockDto)
        {
            if (updateStockDto == null || !ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var producto = _productoRepository.GetProducto(id);
            if (producto == null)
            {
                return NotFound($"El producto con el id {id} no existe");
            }

            if (updateStockDto.TipoMovimiento == TipoMovimiento.Entrada)
            {
                producto.StockActual += updateStockDto.Cantidad;
            }
            else if (updateStockDto.TipoMovimiento == TipoMovimiento.Salida)
            {
                if (producto.StockActual < updateStockDto.Cantidad)
                {
                    ModelState.AddModelError("CustomError", $"Stock insuficiente para {producto.Nombre}. Disponible: {producto.StockActual}");
                    return BadRequest(ModelState);
                }
                producto.StockActual -= updateStockDto.Cantidad;
            }
            else
            {
                ModelState.AddModelError("CustomError", $"El tipo de movimiento debe ser {TipoMovimiento.Entrada} o {TipoMovimiento.Salida}");
                return BadRequest(ModelState);
            }

            if (!_productoRepository.UpdateProducto(producto))
            {
                ModelState.AddModelError("CustomError", $"Algo salió mal al actualizar el stock de {producto.Nombre}");
                return StatusCode(500, ModelState);
            }

            return Ok(_mapper.Map<ProductoDto>(producto));
        }

        // Eliminar producto
        [HttpDelete("{id:int}", Name = "DeleteProducto")]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public IActionResult DeleteProducto(int id)
        {
            var producto = _productoRepository.GetProducto(id);
            if (producto == null)
            {
                return NotFound($"El producto con el id {id} no existe");
            }

            if (!_productoRepository.DeleteProducto(producto))
            {
                ModelState.AddModelError("CustomError", $"Algo salió mal al eliminar el registro {producto.Nombre}");
                return StatusCode(500, ModelState);
            }

            return NoContent();
        }
    }
}
