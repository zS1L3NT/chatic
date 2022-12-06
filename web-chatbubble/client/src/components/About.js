import React, { useEffect } from "react"

const time = secs => new Promise(resolve => setTimeout(_ => resolve(), secs))

export default function About() {
	const changeLogs = [
		{
			version: "v2.6 Ready for showcase!",
			new: [
				"Scroll down button in `Chat`",
				"New URL for page! chat.bubblejs.com"
			],
			fix: ["Page loads faster. CSS Imports are now npm local packages"],
			change: ["Chat scrolling settings when on mobile"]
		},
		{
			version: "v2.5.1",
			new: [],
			fix: [
				"Used to always reach database connection limit after a few minutes of conversation"
			],
			change: ["Backend database connection code"]
		},
		{
			version: "v2.5 Final",
			new: [
				"Implemented Cloudinary API to upload and store images online"
			],
			fix: ["Issue where profile pictures don't load."],
			change: ["Removed `Help` Page because it wasn't necessary"]
		},
		{
			version: "v2.4 Polished",
			new: [
				"Now you can block your annoying friends who spam you!",
				"Now you can delete your account. We'll be sad to see you go though..."
			],
			fix: [
				"Fixed problem where chats load extremely slowly and logging in takes a long time"
			],
			change: []
		},
		{
			version: "v2.3",
			new: ["New text for `ChatBubble`"],
			fix: ["Internal Server Errors"],
			change: ["Button positions in the `Account` page"]
		},
		{
			version: "v2.2",
			new: [
				"Added a `Help` page for users in need of help",
				"Shows all Web Technologies used in `About` page"
			],
			fix: [
				"Fixed many issues with all the user searching input boxes not responding"
			],
			change: ["Changed look and feel of `Account` page"]
		},
		{
			version: "v2.1",
			new: [
				'Background animation changing from "Add Friend" section to "Add Group" section'
			],
			fix: [
				"Issues with browser width on mobile",
				"Issues with animations going away when they aren't supposed to"
			],
			change: ["Optimised logout speed"]
		},
		{
			version: "v2.0",
			new: [
				"Added many new animations to all pages",
				"Added group chats! Find your friends, add them to the chat and start spamming!",
				"Added typing effect to website title",
				"Changed text `ChatBubble` to an image with a font",
				"Added a simple 404 Error handling page"
			],
			fix: [
				"Reduced lag when logging out",
				"Fixed bug when emailing password reset link to user"
			],
			change: []
		},
		{
			version: "v1.7",
			new: [
				'Added a "Forgot my password" function to the login page to help you recover your password'
			],
			fix: [
				"Fixed some email bugs when requesting to verify your account"
			],
			change: []
		},
		{
			version: "v1.6",
			new: [
				"Now you need to verify your account to start chatting. Verification link will be sent to your email.",
				"ChatBubble new text font"
			],
			fix: [],
			change: []
		},
		{
			version: "v1.5.1",
			new: [],
			fix: [
				'Fixed client bug in `Register` where pressing the "Enter" key redirects you to the `Login` page'
			],
			change: []
		},
		{
			version: "v1.5",
			new: [],
			fix: ["Reduce internet spam when typing"],
			change: ["Only allow account to be logged in on 1 device at a time"]
		},
		{
			version: "v1.4",
			new: [
				"Added an edit message and delete message button for each message",
				"Added a number beside each edited message indicating how many times it has been edited",
				"Loader bar indicating chats are loading"
			],
			fix: [
				"Fixed a multi chatting bug",
				"Optimised message status setting",
				"If you are using the non-secure HTTP, you will be automatically redirected to secure HTTPS"
			],
			change: ["Reduce margins for chat box when using mobile devies"]
		},
		{
			version: "v1.3",
			new: [
				"Added online status for all users that are online. Green means online and grey means offline"
			],
			fix: [
				"Fixed bug where you are unable to access `Account` page",
				"Optimised mobile view for changelogs"
			],
			change: ["Changed look and feel of Change Logs"]
		},
		{
			version: "v1.2",
			new: [
				"Added a number indicating how many unread messages you have from each specific chat",
				"Added the Change Logs you are reading right now"
			],
			fix: [
				"Incoming messages now get detected properly",
				"Fixed bug where ChatBot conversation gets updated instead of the respective chat when you recieve a message"
			],
			change: []
		},
		{
			version: "v1.1",
			new: [
				"Now you can see when the user is typing and when the user is not",
				"Added a status to each message"
			],
			fix: [],
			change: [
				'Moved "Add Friend" section to chat page. Click an icon to add a friend.'
			]
		}
	]

	const TxtType = function (el, toRotate, period) {
		this.toRotate = toRotate
		this.el = el
		this.loopNum = 0
		this.period = parseInt(period, 10) || 2000
		this.txt = ""
		this.tick()
		this.isDeleting = false
	}

	TxtType.prototype.tick = function () {
		var i = this.loopNum % this.toRotate.length
		var fullTxt = this.toRotate[i]

		if (this.isDeleting)
			this.txt = fullTxt.substring(0, this.txt.length - 1)
		else this.txt = fullTxt.substring(0, this.txt.length + 1)

		this.el.innerHTML = '<span class="wrap">' + this.txt + "</span>"

		var delta = 160 - Math.random() * 100

		if (this.isDeleting) delta /= 3

		if (!this.isDeleting && this.txt === fullTxt) {
			delta = this.period
			this.isDeleting = true
		} else if (this.isDeleting && this.txt === "") {
			this.isDeleting = false
			this.loopNum++
			delta = 500
		}

		setTimeout(_ => this.tick(), delta)
	}

	useEffect(_ => {
		;(async _ => {
			await time(1000)
			const elements = document.getElementsByClassName("typewrite")
			for (let i = 0; i < elements.length; i++) {
				let toRotate = elements[i].getAttribute("data-type")
				let period = elements[i].getAttribute("data-period")
				if (toRotate)
					new TxtType(elements[i], JSON.parse(toRotate), period)
			}
		})()
	}, [])

	return (
		<article id="aboutPage">
			<section className="jumbotron text-center">
				<div className="container">
					<img
						src="/icons/favicon.ico"
						alt="logo"
						width="100"
						height="100"
						className="mb-4"
						data-aos="zoom-in-up"
					/>
					<br />
					<img
						src="./icons/chatbubble.png"
						alt=""
						style={{ marginBottom: "21px" }}
						data-aos="zoom-out-down"
					/>
					<p
						className="lead text-muted typewrite"
						data-period="2000"
						data-type='["A simple online Chat Application",
							"Developed by a 16 year old Full Stack Developer",
							"Built to be like a Modern Chat Web Application"]'>
						<span className="wrap"></span>
					</p>
					<p className="text-muted">
						Unlike any other JavaScript Chat Website you can find
						online!
					</p>
				</div>
			</section>
			<main role="main" className="container">
				<div className="row">
					<div className="col-md-8">
						<div data-aos="fade-down-right">
							<h1>About this website</h1>
							<p>
								This is my second chat application but it is my
								first Full Stack JavaScript Web Application. I
								aim to become a JavaScript Web Developer and
								Designer. This website was build so that I could
								get a better understanding of how Web
								Technologies like the MERN (MongoDB, ExpressJS,
								ReactJS and NodeJS) work together to make
								interactive and powerful websites
							</p>
						</div>

						<div data-aos="fade-up-left">
							<br />
							<h2>Change Logs</h2>
							<h5>
								Current version: <b>{changeLogs[0].version}</b>
							</h5>
						</div>

						<br />

						{changeLogs.map(log => (
							<div
								className="cl-item"
								key={log.version}
								data-aos="zoom-out-down">
								<div className="cl-content">
									<div
										className="cl-title"
										data-aos="fade-right">
										{log.version}
									</div>
									{JSON.stringify(log.new) !== "[]" ? (
										<>
											<div
												className="cl-type cl-new"
												data-aos="flip-left">
												New Features
											</div>
											<ul>
												{log.new.map((item, i) => (
													<li key={i}>{item}</li>
												))}
											</ul>
										</>
									) : null}
									{JSON.stringify(log.fix) !== "[]" ? (
										<>
											<div
												className="cl-type cl-fix"
												data-aos="flip-left">
												Fixes
											</div>
											<ul>
												{log.fix.map((item, i) => (
													<li key={i}>{item}</li>
												))}
											</ul>
										</>
									) : null}
									{JSON.stringify(log.change) !== "[]" ? (
										<>
											<div
												className="cl-type cl-change"
												data-aos="flip-left">
												Changes
											</div>
											<ul>
												{log.change.map((item, i) => (
													<li key={i}>{item}</li>
												))}
											</ul>
										</>
									) : null}
								</div>
							</div>
						))}
					</div>
					<aside className="col-md-4" data-aos="fade-up">
						<div className="p-3 mb-3">
							<h4 className="font-italic">Social Media</h4>
							<p className="mb-0">
								Follow me on&nbsp;
								<a
									href="https://instagram.com/zec.har.iah"
									target="_blank"
									rel="noopener noreferrer">
									Instagram
								</a>
							</p>
							<p className="mb-0">
								Check out my&nbsp;
								<a
									href="https://github.com/zS1L3NT"
									target="_blank"
									rel="noopener noreferrer">
									GitHub
								</a>
							</p>
						</div>
					</aside>
				</div>
			</main>
		</article>
	)
}
