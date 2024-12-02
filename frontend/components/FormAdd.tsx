'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface Field {
    name: string;
    label: string;
    type: string; // Maintenant, acceptons tout type HTML valide
    placeholder?: string; // Optionnel, utilisé pour des champs comme 'textarea'
    min?: string; // Optionnel, utilisé pour des champs comme 'number' ou 'date'
    max?: string; // Optionnel, utilisé pour des champs comme 'number' ou 'date'
    step?: string; // Optionnel, utilisé pour des champs comme 'number' ou 'date'
}

interface FormProps {
    formTitle: string; // Titre du formulaire
    fields: Field[]; // Liste des champs à afficher dans le formulaire
    data?: any; // Données de l'élément à modifier (facultatif)
    onSubmit: (formData: any) => void; // Fonction pour soumettre le formulaire
    onCancel: () => void; // Fonction pour annuler l'action
}
// FormAdd
export function FormAdd({ formTitle, fields, data, onSubmit, onCancel }: FormProps) {
    const [formData, setFormData] = useState<any>(data || {})

    useEffect(() => {
        if (data) {
            setFormData(data)
        }
    }, [data])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSubmit(formData)
        onCancel()
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4 mt-4 bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl text-indigo-300 mb-4">{formTitle}</h2>

            {fields.map((field) => (
                <div key={field.name}>
                    <Label htmlFor={field.name} className="text-indigo-300">{field.label}</Label>
                    {field.type === 'textarea' ? (
                        <textarea
                            id={field.name}
                            name={field.name}
                            value={formData[field.name] || ''}
                            onChange={handleChange}
                            placeholder={field.placeholder}
                            required
                            className="bg-gray-700 text-white border-gray-600 focus:border-indigo-500 p-2 w-full"
                        />
                    ) : (
                        <Input
                            id={field.name}
                            name={field.name}
                            type={field.type}
                            value={formData[field.name] || ''}
                            onChange={handleChange}
                            placeholder={field.placeholder}
                            min={field.min}
                            max={field.max}
                            step={field.step}
                            required
                            className="bg-gray-700 text-white border-gray-600 focus:border-indigo-500"
                        />
                    )}
                </div>
            ))}

            <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={onCancel} className="bg-gray-700 text-indigo-300 hover:bg-gray-600">Annuler</Button>
                <Button type="submit" className="bg-indigo-600 text-white hover:bg-indigo-700">
                    {data ? 'Modifier' : 'Ajouter'}
                </Button>
            </div>
        </form>
    )
}
