using AutoMapper;
using EPP_MOVIMIENTO_API.Models;
using EPP_MOVIMIENTO_API.Models.Dtos.Empleado;

namespace EPP_MOVIMIENTO_API.Mapping
{
    public class EmpleadoProfile:Profile
    {
        public EmpleadoProfile()
        {
            CreateMap<Empleado, EmpleadoDto>()
                .ForMember(dest => dest.NombreCompleto, opt => opt.MapFrom(src => src.Nombre + " " + src.Apellidos))
                .ForMember(dest => dest.Departamento, opt => opt.MapFrom(src => src.Departamento ?? string.Empty))
                .ForMember(dest => dest.Puesto, opt => opt.MapFrom(src => src.Puesto ?? string.Empty));
            CreateMap<CreateEmpleadoDto, Empleado>();
            CreateMap<UpdateEmpleadoDto, Empleado>();
        }
    }
}
