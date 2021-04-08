import React, { useState } from "react"
import Cropper from "react-easy-crop"
import "./ImageSelector.scss"

interface props {
	open: boolean
	SETopen: React.Dispatch<React.SetStateAction<boolean>>
	SETres: (url: string) => void
}

export default function ImageSelector(props: props) {
	const { open, SETopen, SETres } = props
	const [file, SETfile] = useState<File>()
	const [base64, SETbase64] = useState("")
	const [blob, SETblob] = useState<Blob>()
	const [crop, SETcrop] = useState({ x: 0, y: 0 })
	const [zoom, SETzoom] = useState(1)
	const [response, SETresponse] = useState("")

	const handleImgAsFile = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (!e.target.files) return
		const image = e.target.files[0]

		let tmp = image.name.split(".")
		const extension = tmp[tmp.length - 1]
		if (!["png", "jpg", "jpeg"].includes(extension.toLowerCase()))
			return SETresponse("File must be of types .png, .jpg or .jpeg")

		if (image.size > 10000000)
			return SETresponse("File exceeds 10MB, may crash client")

		SETfile(image)
		SETresponse("")

		const reader = new FileReader()
		reader.readAsDataURL(image)
		reader.onload = () => SETbase64(reader.result as string)
		reader.onerror = () => SETresponse("Error reading image")
	}

	const onCropComplete = async (_: any, croppedAreaPixels: any) => {
		const croppedImage = await getCroppedImg(base64, croppedAreaPixels)
		if (croppedImage) SETblob(croppedImage)
	}

	const onDone = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		SETres(URL.createObjectURL(blob))
		SETopen(false)
	}

	return (
		<section className="imageselector">
			<div
				className={"imageselector__bg" + (open ? " active" : "")}
				onClick={() => SETopen(false)}></div>
			<form
				className={"imageselector__form" + (open ? " active" : "")}
				onSubmit={onDone}>
				<div className="imageselector__form__choose">
					<label
						htmlFor="upload-file"
						className="imageselector__form__choose__label">
						<i className="fa fa-cloud-upload"></i>{" "}
						{file ? file.name : "Select File to Upload to Cloud"}
					</label>
					<input
						type="file"
						id="upload-file"
						accept=".png, .jpg, .jpeg"
						onChange={handleImgAsFile}
						className="imageselector__form__choose__input"
					/>
					<button className="imageselector__form__choose__submit">
						Done
					</button>
					{response ? (
						<p className="imageselector__form__choose__p">
							{response}
						</p>
					) : (
						<></>
					)}
				</div>

				<div className="imageselector__form__crop">
					{base64 ? (
						<Cropper
							image={base64}
							crop={crop}
							zoom={zoom}
							aspect={1}
							onCropChange={SETcrop}
							onCropComplete={onCropComplete}
							onZoomChange={SETzoom}
						/>
					) : (
						<></>
					)}
				</div>
			</form>
		</section>
	)
}

const createImage = (url: string) =>
	new Promise<HTMLImageElement>((resolve, reject) => {
		const image = new Image()
		image.addEventListener("load", () => resolve(image))
		image.addEventListener("error", error => reject(error))
		image.setAttribute("crossOrigin", "anonymous")
		image.src = url
	})

const getCroppedImg = async (imageSrc: string, crop: any) => {
	const image = await createImage(imageSrc)
	const canvas = document.createElement("canvas")
	const ctx = canvas.getContext("2d")!

	/* setting canvas width & height allows us to 
    resize from the original image resolution */
	canvas.width = crop.width
	canvas.height = crop.height

	ctx.drawImage(
		image,
		crop.x,
		crop.y,
		crop.width,
		crop.height,
		0,
		0,
		canvas.width,
		canvas.height
	)

	return new Promise<Blob | null>(resolve => {
		canvas.toBlob(blob => {
			resolve(blob)
		}, "image/jpeg")
	})
}
