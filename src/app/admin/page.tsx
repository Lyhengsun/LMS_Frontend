import { redirect } from 'next/navigation'
import React from 'react'

const AdminPage = () => {
  redirect("/admin/dashboard")
}

export default AdminPage