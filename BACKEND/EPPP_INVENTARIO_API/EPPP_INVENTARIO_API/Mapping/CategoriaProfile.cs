using AutoMapper;
using EPPP_INVENTARIO_API.Models;
using EPPP_INVENTARIO_API.Models.Dtos.Categoria;
namespace EPPP_INVENTARIO_API.Mapping
{
    public class CategoriaProfile:Profile
    {
        public CategoriaProfile()
        {
            CreateMap<Categoria, CategoriaDto>().ReverseMap();
            CreateMap<Categoria, CreateCategoriaDto>().ReverseMap();
            CreateMap<Categoria, UpdateCategoriaDto>().ReverseMap();
        }
    }
}
