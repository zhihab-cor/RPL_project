// app/auth/callback/route.ts
import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')
    const origin = requestUrl.origin

    if (code) {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        const supabase = createClient(supabaseUrl, supabaseKey)

        // Exchange code for session
        const { data: { session }, error: authError } = await supabase.auth.exchangeCodeForSession(code)

        if (authError || !session) {
            console.error('Auth error:', authError)
            return NextResponse.redirect(`${origin}/login?error=auth_failed`)
        }

        const authUser = session.user

        // Check if user exists in User table
        const { data: existingUser, error: dbError } = await supabase
            .from('User')
            .select('*')
            .eq('email', authUser.email)
            .single()

        if (existingUser) {
            // User exists, redirect based on role
            const role = existingUser.role?.toUpperCase() || ''

            // Create response with redirect
            let redirectPath = '/dashboard'
            if (role === 'ADMIN') {
                redirectPath = '/admin/dashboard'
            } else if (role === 'DOCTOR') {
                redirectPath = '/dokter/dashboard'
            }

            const response = NextResponse.redirect(`${origin}${redirectPath}`)

            // Set user data in cookie for client-side access
            response.cookies.set('user_data', JSON.stringify(existingUser), {
                httpOnly: false,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 60 * 60 * 24 * 7 // 7 days
            })

            return response
        } else {
            // New user from Google OAuth - create in User table
            const { data: newUser, error: insertError } = await supabase
                .from('User')
                .insert({
                    name: authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'User',
                    email: authUser.email,
                    password: null, // OAuth users don't have password
                    nik: null,
                    birthDate: null,
                    role: 'PATIENT',
                })
                .select()
                .single()

            if (insertError) {
                console.error('Insert error:', insertError)
                return NextResponse.redirect(`${origin}/login?error=create_user_failed`)
            }

            const response = NextResponse.redirect(`${origin}/dashboard`)

            response.cookies.set('user_data', JSON.stringify(newUser), {
                httpOnly: false,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 60 * 60 * 24 * 7
            })

            return response
        }
    }

    // No code present, redirect to login
    return NextResponse.redirect(`${origin}/login`)
}
