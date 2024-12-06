'use client'

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/cards/card-profile"

export default function AdminForm() {

    // create a new user
    const [user, setUser] = useState({
        firstname: 'Med-Amine',
        lastname: 'Fatih',
        email: 'amine@gmail.com',
        phone: '1234567890',
        address: '1234 Elm Street',
        password: 'password',
    })

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
            <Card className="w-full max-w-lg bg-slate-900 text-slate-100 border border-slate-800">
                <CardHeader>
                    <CardTitle className="text-2xl text-slate-100">Edit Profile</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label htmlFor="firstname" className="block text-sm font-medium text-slate-200">First Name</label>
                            <input
                                id="firstname"
                                value={user.firstname}
                                placeholder="Enter your first name"
                                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="lastname" className="block text-sm font-medium text-slate-200">Last Name</label>
                            <input
                                id="lastname"
                                value={user.lastname}
                                placeholder="Enter your last name"
                                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="email" className="block text-sm font-medium text-slate-200">Email</label>
                        <input
                            id="email"
                            type="email"
                            value={user.email}
                            placeholder="Enter your email"
                            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="phone" className="block text-sm font-medium text-slate-200">Phone</label>
                        <input
                            id="phone"
                            type="tel"
                            value={user.phone}
                            placeholder="Enter your phone number"
                            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="address" className="block text-sm font-medium text-slate-200">Address</label>
                        <input
                            id="address"
                            value={user.address}
                            placeholder="Enter your address"
                            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="password" className="block text-sm font-medium text-slate-200">Password</label>
                        <input
                            id="password"
                            type="password"
                            value={user.password}
                            placeholder="Enter your password"
                            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                    </div>
                    <button className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900">
                        Save Changes
                    </button>
                </CardContent>
            </Card>
        </div>
    )
}
