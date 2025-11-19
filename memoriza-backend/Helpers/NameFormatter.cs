using System;

namespace memoriza_backend.Helpers
{
    public static class NameFormatter
    {
        // Normaliza nome e sobrenome: deixa cada palavra com inicial maiúscula
        public static string NormalizeName(string name)
        {
            if (string.IsNullOrWhiteSpace(name))
                return name;

            // Remove espaços extras e deixa tudo minúsculo
            name = name.Trim().ToLowerInvariant();

            // Divide em palavras
            var parts = name.Split(' ', StringSplitOptions.RemoveEmptyEntries);

            // Capitaliza cada palavra
            for (int i = 0; i < parts.Length; i++)
            {
                var word = parts[i];

                if (word.Length == 1)
                {
                    parts[i] = char.ToUpperInvariant(word[0]).ToString();
                }
                else
                {
                    parts[i] = char.ToUpperInvariant(word[0]) + word.Substring(1);
                }
            }

            return string.Join(' ', parts);
        }
    }
}