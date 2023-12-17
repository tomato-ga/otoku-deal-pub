import AdminHeader from './AdminHeader'

const AdminLayout = ({ children }) => {
	return (
		<>
        <AdminHeader />
			<div className="admin-content">{children}</div>
		</>
	)
}

export default AdminLayout
