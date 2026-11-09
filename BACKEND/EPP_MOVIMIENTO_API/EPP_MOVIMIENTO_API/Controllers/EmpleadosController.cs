using AutoMapper;
using EPP_MOVIMIENTO_API.Constants;
using EPP_MOVIMIENTO_API.Models;
using EPP_MOVIMIENTO_API.Models.Dtos.Empleado;
using EPP_MOVIMIENTO_API.Repository.IRepository;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;

namespace EPP_MOVIMIENTO_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [EnableCors(PolicyNames.AllowSpecificOrigin)]
    public class EmpleadosController : ControllerBase
    {
        private readonly IEmpleadoRepository _empleadoRepository;
        private readonly IMapper _mapper;

        public EmpleadosController(IEmpleadoRepository empleadoRepository, IMapper mapper)
        {
            _empleadoRepository = empleadoRepository;
            _mapper = mapper;
        }

        //Listar empleados
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public IActionResult GetEmpleados()
        {
            var empleados = _empleadoRepository.GetEmpleados();
            var empleadosDto = new List<EmpleadoDto>();
            foreach (var empleado in empleados)
            {
                empleadosDto.Add(_mapper.Map<EmpleadoDto>(empleado));
            }
            return Ok(empleadosDto);
        }

        //Buscar por id
        [HttpGet("{id:int}", Name = "GetEmpleado")]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public IActionResult GetEmpleado(int id)
        {
            var empleado = _empleadoRepository.GetEmpleado(id);
            if (empleado == null)
            {
                return NotFound($"El empleado con el id {id} no existe");
            }

            var empleadoDto = _mapper.Map<EmpleadoDto>(empleado);
            return Ok(empleadoDto);
        }

        //Crear empleado
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public IActionResult CreateEmpleado([FromBody] CreateEmpleadoDto createEmpleadoDto)
        {
            if (createEmpleadoDto == null || !ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (_empleadoRepository.EmpleadoExists(createEmpleadoDto.NumEmpleado))
            {
                ModelState.AddModelError("CustomError", $"Ya existe un empleado con el número {createEmpleadoDto.NumEmpleado}");
                return BadRequest(ModelState);
            }

            var empleado = _mapper.Map<Empleado>(createEmpleadoDto);
            if (!_empleadoRepository.CreateEmpleado(empleado))
            {
                ModelState.AddModelError("CustomError", $"Algo salió mal al guardar el registro {empleado.Nombre}");
                return StatusCode(500, ModelState);
            }

            return CreatedAtRoute("GetEmpleado", new { id = empleado.EmpleadoId }, _mapper.Map<EmpleadoDto>(empleado));
        }

        //Editar empleado
        [HttpPatch("{id:int}", Name = "UpdateEmpleado")]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public IActionResult UpdateEmpleado(int id, [FromBody] UpdateEmpleadoDto updateEmpleadoDto)
        {
            if (updateEmpleadoDto == null || !ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var empleado = _empleadoRepository.GetEmpleado(id);
            if (empleado == null)
            {
                return NotFound($"No se encontró un empleado con el id {id}");
            }

            if (_empleadoRepository.EmpleadoExists(updateEmpleadoDto.NumEmpleado, id))
            {
                ModelState.AddModelError("CustomError", $"Ya existe otro empleado con el número {updateEmpleadoDto.NumEmpleado}");
                return BadRequest(ModelState);
            }

            // Se mapea sobre la entidad existente para conservar id y fecha de alta
            _mapper.Map(updateEmpleadoDto, empleado);
            if (!_empleadoRepository.UpdateEmpleado(empleado))
            {
                ModelState.AddModelError("CustomError", $"Algo salió mal al actualizar el registro {empleado.Nombre}");
                return StatusCode(500, ModelState);
            }

            return NoContent();
        }

        //Eliminar empleado
        [HttpDelete("{id:int}", Name = "DeleteEmpleado")]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public IActionResult DeleteEmpleado(int id)
        {
            var empleado = _empleadoRepository.GetEmpleado(id);
            if (empleado == null)
            {
                return NotFound($"No se encontró un empleado con el id {id}");
            }

            if (_empleadoRepository.EmpleadoHasMovimientos(id))
            {
                ModelState.AddModelError("CustomError", $"No se puede eliminar a {empleado.Nombre} porque tiene movimientos registrados. Puedes desactivarlo.");
                return BadRequest(ModelState);
            }

            if (!_empleadoRepository.DeleteEmpleado(empleado))
            {
                ModelState.AddModelError("CustomError", $"Algo salió mal al eliminar el registro {empleado.Nombre}");
                return StatusCode(500, ModelState);
            }

            return NoContent();
        }
    }
}
