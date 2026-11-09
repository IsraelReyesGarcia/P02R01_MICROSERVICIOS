using AutoMapper;
using EPP_MOVIMIENTO_API.Constants;
using EPP_MOVIMIENTO_API.Models;
using EPP_MOVIMIENTO_API.Models.Dtos.Movimiento;
using EPP_MOVIMIENTO_API.Repository.IRepository;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;

namespace EPP_MOVIMIENTO_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [EnableCors(PolicyNames.AllowSpecificOrigin)]
    public class MovimientosController : ControllerBase
    {
        private readonly IMovimientoRepository _movimientoRepository;
        private readonly IEmpleadoRepository _empleadoRepository;
        private readonly IMapper _mapper;

        public MovimientosController(IMovimientoRepository movimientoRepository, IEmpleadoRepository empleadoRepository, IMapper mapper)
        {
            _movimientoRepository = movimientoRepository;
            _empleadoRepository = empleadoRepository;
            _mapper = mapper;
        }

        //Listar movimientos
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public IActionResult GetMovimientos()
        {
            var movimientos = _movimientoRepository.GetMovimientos();
            return Ok(MapList(movimientos));
        }

        //Buscar por id
        [HttpGet("{id:int}", Name = "GetMovimiento")]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public IActionResult GetMovimiento(int id)
        {
            var movimiento = _movimientoRepository.GetMovimiento(id);
            if (movimiento == null)
            {
                return NotFound($"El movimiento con el id {id} no existe");
            }

            return Ok(_mapper.Map<MovimientoDto>(movimiento));
        }

        //Movimientos por empleado
        [HttpGet("Empleado/{empleadoId:int}", Name = "GetMovimientosByEmpleado")]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public IActionResult GetMovimientosByEmpleado(int empleadoId)
        {
            if (!_empleadoRepository.EmpleadoExists(empleadoId))
            {
                return NotFound($"El empleado con el id {empleadoId} no existe");
            }

            var movimientos = _movimientoRepository.GetMovimientosByEmpleado(empleadoId);
            return Ok(MapList(movimientos));
        }

        //Movimientos por producto
        [HttpGet("Producto/{productoId:int}", Name = "GetMovimientosByProducto")]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public IActionResult GetMovimientosByProducto(int productoId)
        {
            var movimientos = _movimientoRepository.GetMovimientosByProducto(productoId);
            return Ok(MapList(movimientos));
        }

        //Crear movimiento
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public IActionResult CreateMovimiento([FromBody] CreateMovimientoDto createMovimientoDto)
        {
            if (createMovimientoDto == null || !ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (!TipoMovimiento.IsValid(createMovimientoDto.TipoMovimiento))
            {
                ModelState.AddModelError("CustomError", $"El tipo de movimiento debe ser {TipoMovimiento.Entrada} o {TipoMovimiento.Salida}");
                return BadRequest(ModelState);
            }

            if (createMovimientoDto.TipoMovimiento == TipoMovimiento.Salida && createMovimientoDto.EmpleadoId == null)
            {
                ModelState.AddModelError("CustomError", "Una salida requiere el empleado que recibe el equipo");
                return BadRequest(ModelState);
            }

            if (createMovimientoDto.EmpleadoId != null)
            {
                var empleado = _empleadoRepository.GetEmpleado(createMovimientoDto.EmpleadoId.Value);
                if (empleado == null)
                {
                    ModelState.AddModelError("CustomError", $"El empleado con el id {createMovimientoDto.EmpleadoId} no existe");
                    return BadRequest(ModelState);
                }
                if (!empleado.Activo)
                {
                    ModelState.AddModelError("CustomError", $"El empleado {empleado.Nombre} {empleado.Apellidos} está inactivo");
                    return BadRequest(ModelState);
                }
            }

            var movimiento = _mapper.Map<Movimiento>(createMovimientoDto);
            if (!_movimientoRepository.CreateMovimiento(movimiento))
            {
                ModelState.AddModelError("CustomError", $"Algo salió mal al registrar el movimiento de {movimiento.ProductoNombre}");
                return StatusCode(500, ModelState);
            }

            var movimientoDto = _mapper.Map<MovimientoDto>(_movimientoRepository.GetMovimiento(movimiento.MovimientoId));
            return CreatedAtRoute("GetMovimiento", new { id = movimiento.MovimientoId }, movimientoDto);
        }

        //Eliminar movimiento
        [HttpDelete("{id:int}", Name = "DeleteMovimiento")]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public IActionResult DeleteMovimiento(int id)
        {
            var movimiento = _movimientoRepository.GetMovimiento(id);
            if (movimiento == null)
            {
                return NotFound($"No se encontró un movimiento con el id {id}");
            }

            if (!_movimientoRepository.DeleteMovimiento(movimiento))
            {
                ModelState.AddModelError("CustomError", $"Algo salió mal al eliminar el movimiento {id}");
                return StatusCode(500, ModelState);
            }

            return NoContent();
        }

        private List<MovimientoDto> MapList(ICollection<Movimiento> movimientos)
        {
            var movimientosDto = new List<MovimientoDto>();
            foreach (var movimiento in movimientos)
            {
                movimientosDto.Add(_mapper.Map<MovimientoDto>(movimiento));
            }
            return movimientosDto;
        }
    }
}
