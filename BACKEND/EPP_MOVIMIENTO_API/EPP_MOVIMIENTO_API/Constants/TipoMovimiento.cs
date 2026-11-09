namespace EPP_MOVIMIENTO_API.Constants
{
    public static class TipoMovimiento
    {
        public const string Entrada = "Entrada";
        public const string Salida = "Salida";

        public static bool IsValid(string tipo)
        {
            return tipo == Entrada || tipo == Salida;
        }
    }
}
