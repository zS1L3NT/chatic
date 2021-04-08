import { useHistory } from "react-router-dom"
import { IUser } from "../../../Types"
import AsyncImage from "../../../components/AsyncImage/AsyncImage"
import "./Sidebar.scss"

interface props {
	menu: "profile" | "security" | "groups"
	user?: IUser
}

export default function Sidebar(props: props) {
	const { menu, user } = props

	const history = useHistory()

	const menus: { url: string; icon: string; title: string }[] = [
		{
			url: "profile",
			icon: "user",
			title: "Profile"
		},
		{
			url: "security",
			icon: "lock",
			title: "Security"
		},
		{
			url: "groups",
			icon: "comments",
			title: "Groups"
		}
	]

	return (
		<aside className="sidebar">
			<div className="sidebar__icon">
				<AsyncImage src={user?.pfp} className="sidebar__icon__img" />
			</div>
			{menus.map(({ url, icon, title }) => (
				<div
					key={url}
					className={
						`sidebar__menu` + (menu === url ? " active" : "")
					}
					onClick={() => history.push("/settings/" + url)}>
					<div className="sidebar__menu__wrapper">
						<i
							className={
								"sidebar__menu__wrapper__i fa fa-" + icon
							}></i>
						<p className="sidebar__menu__wrapper__p">{title}</p>
					</div>
				</div>
			))}
		</aside>
	)
}
