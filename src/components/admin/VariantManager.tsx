'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus, Trash2 } from 'lucide-react'

type Variant = {
  size: string
  color: string
  stock: number
  sku: string
  price?: number
  salePrice?: number
}

interface VariantManagerProps {
  variants: Variant[]
  onChange: (variants: Variant[]) => void
  hasColor?: boolean
  productName?: string
  sizeLabel?: string
  colorLabel?: string
}

export default function VariantManager({
  variants,
  onChange,
  hasColor = true,
  productName = '',
  sizeLabel = 'Size',
  colorLabel = 'Color'
}: VariantManagerProps) {
  
  const addVariant = () => {
    onChange([...variants, { 
      size: '', 
      color: hasColor ? '' : 'Default', 
      stock: 0, 
      sku: '' 
    }])
  }

  const removeVariant = (index: number) => {
    onChange(variants.filter((_, i) => i !== index))
  }

  const updateVariant = (index: number, field: keyof Variant, value: any) => {
    const updated = variants.map((v, i) => 
      i === index ? { ...v, [field]: value } : v
    )
    onChange(updated)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold">Product Variants</h4>
        <Button type="button" variant="outline" size="sm" onClick={addVariant}>
          <Plus className="w-4 h-4 mr-2" />
          Add Variant
        </Button>
      </div>

      {variants.length === 0 ? (
        <div className="text-center py-8 border-2 border-dashed rounded-lg">
          <p className="text-muted-foreground">No variants added yet</p>
          <Button type="button" variant="ghost" onClick={addVariant} className="mt-2">
            <Plus className="w-4 h-4 mr-2" />
            Add First Variant
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {variants.map((variant, index) => (
            <div key={index} className="p-4 border rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-medium text-sm">Variant {index + 1}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeVariant(index)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <Label className="text-xs">{sizeLabel}</Label>
                  <Input
                    value={variant.size}
                    onChange={(e) => updateVariant(index, 'size', e.target.value)}
                    placeholder="e.g., M"
                    className="h-9"
                  />
                </div>

                {hasColor && (
                  <div>
                    <Label className="text-xs">{colorLabel}</Label>
                    <Input
                      value={variant.color}
                      onChange={(e) => updateVariant(index, 'color', e.target.value)}
                      placeholder="e.g., Red"
                      className="h-9"
                    />
                  </div>
                )}

                <div>
                  <Label className="text-xs">Stock</Label>
                  <Input
                    type="number"
                    value={variant.stock}
                    onChange={(e) => updateVariant(index, 'stock', parseInt(e.target.value) || 0)}
                    placeholder="0"
                    className="h-9"
                  />
                </div>

                <div>
                  <Label className="text-xs">SKU</Label>
                  <Input
                    value={variant.sku}
                    onChange={(e) => updateVariant(index, 'sku', e.target.value)}
                    placeholder="Auto-generated"
                    className="h-9"
                  />
                </div>

                <div>
                  <Label className="text-xs">Price (Optional)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={variant.price || ''}
                    onChange={(e) => updateVariant(index, 'price', e.target.value ? parseFloat(e.target.value) : undefined)}
                    placeholder="Override base price"
                    className="h-9"
                  />
                </div>

                <div>
                  <Label className="text-xs">Sale Price (Optional)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={variant.salePrice || ''}
                    onChange={(e) => updateVariant(index, 'salePrice', e.target.value ? parseFloat(e.target.value) : undefined)}
                    placeholder="Sale price"
                    className="h-9"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
