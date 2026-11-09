using AutoMapper;
using EPP_MOVIMIENTO_API.Models;
using EPP_MOVIMIENTO_API.Models.Dtos.Movimiento;

namespace EPP_MOVIMIENTO_API.Mapping
{
    public class MovimientoProfile:Profile
    {
        public MovimientoProfile()
        {
            CreateMap<Movimiento, MovimientoDto>()
                .ForMember(dest => dest.EmpleadoNombre, opt => opt.MapFrom(src => src.Empleado != null ? src.Empleado.Nombre + " " + src.Empleado.Apellidos : string.Empty))
                .ForMember(dest => dest.EmpleadoNumero, opt => opt.MapFrom(src => src.Empleado != null ? src.Empleado.NumEmpleado : string.Empty))
                .ForMember(dest => dest.Motivo, opt => opt.MapFrom(src => src.Motivo ?? string.Empty))
                .ForMember(dest => dest.Registrador, opt => opt.MapFrom(src => src.Registrador ?? string.Empty));
            CreateMap<CreateMovimientoDto, Movimiento>();
        }
    }
}
