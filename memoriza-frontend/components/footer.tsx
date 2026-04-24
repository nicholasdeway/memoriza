import Link from "next/link"
import Image from "next/image"
import { Instagram, Phone, MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="flex flex-col items-start">
            <Image 
              src="/logo-footer.png" 
              alt="Memoriza" 
              width={200} 
              height={60}
              className="h-20 sm:h-24 lg:h-28 w-auto mb-4"
              priority
            />
            <p className="text-primary-foreground/70 text-sm leading-relaxed">
              Papelaria personalizada • Presentes • Brindes • Mimos
            </p>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-medium mb-4 text-sm">Empresa</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="hover:text-primary-foreground/80 transition-colors">
                  Sobre
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-primary-foreground/80 transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/careers" className="hover:text-primary-foreground/80 transition-colors">
                  Carreiras
                </Link>
              </li>
              <li>
                <Link href="/press" className="hover:text-primary-foreground/80 transition-colors">
                  Imprensa
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-medium mb-4 text-sm">Suporte</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/help" className="hover:text-primary-foreground/80 transition-colors">
                  Central de Ajuda
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="hover:text-primary-foreground/80 transition-colors">
                  Envios
                </Link>
              </li>
              <li>
                <Link href="/returns" className="hover:text-primary-foreground/80 transition-colors">
                  Devoluções
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-primary-foreground/80 transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-medium mb-4 text-sm">Contato</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start space-x-2">
                <Instagram size={16} className="mt-0.5 flex-shrink-0" />
                <a 
                  href="https://www.instagram.com/tsmemoriza/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-primary-foreground/80 transition-colors"
                >
                  @tsmemoriza
                </a>
              </li>
              <li className="flex items-start space-x-2">
                <Phone size={16} className="mt-0.5 flex-shrink-0" />
                <span>+55 (34) 99734-7900</span>
              </li>
              <li className="flex items-start space-x-2">
                <MapPin size={16} className="mt-0.5 flex-shrink-0" />
                <span>Uberlândia - MG</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-primary-foreground/20 pt-8 flex flex-col sm:flex-row justify-between items-center text-xs">
          <p>&copy; 2025 Memoriza. Todos os direitos reservados.</p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <Link href="/privacy" className="hover:text-primary-foreground/80 transition-colors">
              Privacidade
            </Link>
            <Link href="/terms" className="hover:text-primary-foreground/80 transition-colors">
              Termos
            </Link>
            <Link href="/cookies" className="hover:text-primary-foreground/80 transition-colors">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}