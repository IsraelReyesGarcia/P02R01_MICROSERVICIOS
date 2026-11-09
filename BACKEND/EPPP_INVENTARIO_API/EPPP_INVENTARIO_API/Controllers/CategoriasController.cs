using AutoMapper;
using EPPP_INVENTARIO_API.Constants;
using EPPP_INVENTARIO_API.Models;
using EPPP_INVENTARIO_API.Models.Dtos.Categoria;
using EPPP_INVENTARIO_API.Repository.IRepository;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;

namespace EPPP_INVENTARIO_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [EnableCors(PolicyNames.AllowSpecificOrigin)]
    public class CategoriasController : ControllerBase
    {
        private readonly ICategoriaRepository _categoriaRepository;
        private readonly IMapper _mapper;

        public CategoriasController(ICategoriaRepository categoriaRepository, IMapper mapper)
        {
            _categoriaRepository = categoriaRepository;
            _mapper = mapper;
        }

        //Listar categorias
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public IActionResult GetCategoria()
        {
            var categorias = _categoriaRepository.GetCategorias();
            var categoriasDto = new List<CategoriaDto>();
            foreach (var categoria in categorias)
            {
                categoriasDto.Add(_mapper.Map<CategoriaDto>(categoria));
            }
            return Ok(categoriasDto);
        }

        //Buscar por id
        [HttpGet("{id:int}", Name = "GetCategoria")]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public IActionResult GetCategory(int id)
        {
            var categoria = _categoriaRepository.GetCategory(id);
            if (categoria == null)
            {
                return NotFound($"La categoria con el id {id} no existe");
            }

            var categoriaDto = _mapper.Map<CategoriaDto>(categoria);
            return Ok(categoriaDto);
        }

        //Crear Categoria
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public IActionResult CreateCategoria([FromBody] CreateCategoriaDto createCategoriaDto)
        {
            if(createCategoriaDto == null)
            {
                return BadRequest(ModelState);
            }

            if (_categoriaRepository.CategoriaExists(createCategoriaDto.Nombre))
            {
                ModelState.AddModelError("CustomError", "La categoria ya existe");
                return BadRequest(ModelState);
            }
            var categoria = _mapper.Map<Categoria>(createCategoriaDto);
            if (!_categoriaRepository.CreateCategoria(categoria))
            {
                ModelState.AddModelError("CustomError", $"Algo salió mal al guardar al registro {categoria.Nombre}");
                return StatusCode(500, ModelState);
            }

            return CreatedAtRoute("GetCategoria", new { id = categoria.CategoriaId }, categoria);
        }

        //Editar Categoria
        [HttpPatch("{id:int}", Name ="UpdateCategoria")]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public IActionResult UpdateCategoria(int id, [FromBody] UpdateCategoriaDto updateCategoriaDto)
        {
            if (!_categoriaRepository.CategoriaExists(id))
            {
                return NotFound($"No se encontró una categoria con el id {id}");
            }

            if (updateCategoriaDto == null)
            {
                return BadRequest(ModelState);
            }

            /*if (_categoriaRepository.CategoriaExists(updateCategoriaDto.Nombre))
            {
                ModelState.AddModelError("CustomError", "La categoria ya existe");
                return BadRequest(ModelState);
            }*/
            var categoria = _mapper.Map<Categoria>(updateCategoriaDto);
            categoria.CategoriaId = id;
            if (!_categoriaRepository.UpdateCategoria(categoria))
            {
                ModelState.AddModelError("CustomError", $"Algo salió mal al actualizar al registro {categoria.Nombre}");
                return StatusCode(500, ModelState);
            }

            return NoContent();
        }

        //Eliminar Categoria
        [HttpDelete("{id:int}", Name = "DeleteCategoria")]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public IActionResult DeleteCategoria(int id)
        {
            if (!_categoriaRepository.CategoriaExists(id))
            {
                return NotFound($"No se encontró una categoria con el id {id}");
            }

            var categoria = _categoriaRepository.GetCategory(id);
            if (categoria == null)
            {
                return NotFound($"No se encontró una categoria con el id {id}");
            }

            if (_categoriaRepository.CategoriaHasProductos(id))
            {
                ModelState.AddModelError("CustomError", $"No se puede eliminar la categoria {categoria.Nombre} porque tiene productos asociados");
                return BadRequest(ModelState);
            }

            if (!_categoriaRepository.DeleteCategoria(categoria))
            {
                ModelState.AddModelError("CustomError", $"Algo salió mal al eliminar el registro {categoria.Nombre}");
                return StatusCode(500, ModelState);
            }

            return NoContent();
        }
    }
}
