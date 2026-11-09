using AutoMapper;
using EPPP_INVENTARIO_API.Models;
using EPPP_INVENTARIO_API.Models.Dtos.Producto;

namespace EPPP_INVENTARIO_API.Mapping
{
    public class ProductoProfile:Profile
    {
        public ProductoProfile()
        {
            CreateMap<Producto, ProductoDto>()
                .ForMember(dest => dest.CategoriaNombre, opt => opt.MapFrom(src => src.Categoria != null ? src.Categoria.Nombre : string.Empty))
                .ForMember(dest => dest.Descripcion, opt => opt.MapFrom(src => src.Descripcion ?? string.Empty))
                .ForMember(dest => dest.Marca, opt => opt.MapFrom(src => src.Marca ?? string.Empty))
                .ForMember(dest => dest.Talla, opt => opt.MapFrom(src => src.Talla ?? string.Empty))
                .ForMember(dest => dest.Precio, opt => opt.MapFrom(src => src.Precio ?? 0));
            CreateMap<CreateProductoDto, Producto>();
            CreateMap<UpdateProductoDto, Producto>();
        }
    }
}
