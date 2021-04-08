import React, { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useHistory } from "react-router-dom"
import Loading from "../../components/Loading/Loading"
import Firebase from "../../Firebase"
import { SetUID } from "../../redux/actions/UIDActions"
import Repo from "../../Repository"

export default function Logout() {
	const dispatch = useDispatch()
	const history = useHistory()
	const ipv4 = useSelector(state => state.ipv4)

	/**
	 * Method to redirect users to "/login" after being logged out
	 */
	useEffect(() => {
		Firebase.SignOut().then(uid => {
			dispatch(SetUID(""))
			Repo.user(uid).presenceIP(ipv4).set(Firebase.offline())
			history.push('/login')
		}).catch(() => {
			history.push('/login')
		})
	}, [dispatch, history, ipv4])

	return <Loading />
}
