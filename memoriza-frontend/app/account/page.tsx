"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { User, Package, Heart, Settings, LogOut } from "lucide-react"
import { useState } from "react"

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <section className="py-8 px-4 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-light text-foreground">Minha Conta</h1>
        </div>
      </section>

      <div className="flex-1 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Sidebar Navigation */}
            <div className="md:col-span-1">
              <div className="sticky top-24 space-y-2">
                {[
                  { id: "overview", label: "Visão Geral", icon: User },
                  { id: "orders", label: "Meus Pedidos", icon: Package },
                  { id: "favorites", label: "Favoritos", icon: Heart },
                  { id: "settings", label: "Configurações", icon: Settings },
                ].map((item) => {
                  const Icon = item.icon
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                        activeTab === item.id ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"
                      }`}
                    >
                      <Icon size={20} />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  )
                })}
                <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-foreground hover:bg-muted transition-colors">
                  <LogOut size={20} />
                  <span className="font-medium">Sair</span>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="md:col-span-3">
              {/* Visão Geral */}
              {activeTab === "overview" && (
                <div className="space-y-8">
                  <div className="bg-card rounded-lg p-6 border border-border">
                    <h2 className="text-2xl font-light text-foreground mb-6">Informações da Conta</h2>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <p className="text-sm text-foreground/60 mb-1">Nome Completo</p>
                          <p className="text-foreground font-medium">João Silva</p>
                        </div>
                        <div>
                          <p className="text-sm text-foreground/60 mb-1">Email</p>
                          <p className="text-foreground font-medium">joao@example.com</p>
                        </div>
                        <div>
                          <p className="text-sm text-foreground/60 mb-1">Telefone</p>
                          <p className="text-foreground font-medium">+55 (11) 98765-4321</p>
                        </div>
                        <div>
                          <p className="text-sm text-foreground/60 mb-1">Data de Cadastro</p>
                          <p className="text-foreground font-medium">15 de Janeiro de 2025</p>
                        </div>
                      </div>
                      <button className="mt-6 border-2 border-primary text-primary px-4 py-2 rounded-lg font-medium hover:bg-primary/5 transition-colors">
                        Editar Informações
                      </button>
                    </div>
                  </div>

                  {/* Estatísticas */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                      { label: "Pedidos Realizados", value: "8" },
                      { label: "Produtos Favoritos", value: "14" },
                      { label: "Pontos de Fidelidade", value: "1,250" },
                    ].map((stat, idx) => (
                      <div key={idx} className="bg-muted p-4 rounded-lg text-center">
                        <p className="text-2xl font-medium text-primary mb-1">{stat.value}</p>
                        <p className="text-sm text-foreground/70">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Pedidos */}
              {activeTab === "orders" && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-light text-foreground mb-6">Meus Pedidos</h2>
                  {[
                    { id: "MEM-20250115-001", date: "15 Jan 2025", status: "Entregue", total: "R$ 259,80" },
                    { id: "MEM-20250110-002", date: "10 Jan 2025", status: "Em Trânsito", total: "R$ 129,90" },
                    { id: "MEM-20250105-003", date: "05 Jan 2025", status: "Processando", total: "R$ 389,70" },
                  ].map((order) => (
                    <div
                      key={order.id}
                      className="border border-border rounded-lg p-4 hover:border-accent/50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-foreground">{order.id}</p>
                          <p className="text-sm text-foreground/60">{order.date}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-foreground">{order.total}</p>
                          <span
                            className={`text-xs font-medium px-2 py-1 rounded-full ${
                              order.status === "Entregue"
                                ? "bg-accent/20 text-accent"
                                : order.status === "Em Trânsito"
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {order.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Favoritos */}
              {activeTab === "favorites" && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-light text-foreground mb-6">Produtos Favoritos</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {[1, 2, 3, 4, 5, 6].map((product) => (
                      <div key={product} className="group cursor-pointer">
                        <div className="bg-muted rounded-lg overflow-hidden mb-3 aspect-square relative">
                          <img
                            src={`/ceholder-svg-key-fav.jpg?key=fav${product}`}
                            alt={`Favorito ${product}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <button className="absolute top-2 right-2 p-2 bg-background rounded-full text-foreground hover:text-accent transition-colors">
                            <Heart size={18} className="fill-current" />
                          </button>
                        </div>
                        <p className="font-medium text-foreground text-sm">Produto {product}</p>
                        <p className="text-primary font-medium">R$ 129,90</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Configurações */}
              {activeTab === "settings" && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-light text-foreground mb-6">Configurações</h2>

                  <div className="space-y-4">
                    <div className="bg-card border border-border rounded-lg p-6">
                      <h3 className="font-medium text-foreground mb-4">Preferências de Notificação</h3>
                      <div className="space-y-3">
                        {["Emails de Pedido", "Ofertas e Promoções", "Atualizações de Produtos", "Newsletter"].map(
                          (pref) => (
                            <label key={pref} className="flex items-center space-x-3 cursor-pointer">
                              <input type="checkbox" defaultChecked className="rounded" />
                              <span className="text-foreground">{pref}</span>
                            </label>
                          ),
                        )}
                      </div>
                    </div>

                    <div className="bg-card border border-border rounded-lg p-6">
                      <h3 className="font-medium text-foreground mb-4">Segurança</h3>
                      <button className="border-2 border-primary text-primary px-4 py-2 rounded-lg font-medium hover:bg-primary/5 transition-colors">
                        Alterar Senha
                      </button>
                    </div>

                    <div className="bg-card border border-border rounded-lg p-6">
                      <h3 className="font-medium text-foreground mb-4">Dados Pessoais</h3>
                      <p className="text-sm text-foreground/70 mb-4">Download ou exclusão de seus dados pessoais</p>
                      <div className="flex gap-3">
                        <button className="border-2 border-border text-foreground px-4 py-2 rounded-lg font-medium hover:border-accent transition-colors">
                          Download
                        </button>
                        <button className="border-2 border-destructive text-destructive px-4 py-2 rounded-lg font-medium hover:bg-destructive/5 transition-colors">
                          Deletar Conta
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
      <WhatsAppButton />
    </div>
  )
}
