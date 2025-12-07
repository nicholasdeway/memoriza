export type CarouselTemplateType = 'default' | 'full_image' | 'overlay' | 'minimal'

export interface CarouselItem {
    id: string
    title: string
    subtitle: string
    ctaText: string
    ctaLink: string
    imageUrl: string
    isActive: boolean
    displayOrder: number
    templateType: CarouselTemplateType
}
