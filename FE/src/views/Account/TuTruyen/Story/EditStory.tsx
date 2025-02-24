import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import avt from 'assets/img/avt.png'
import { storage } from '../../../../firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import Loading from 'components/Loading/Loading';
import LoadingData from 'components/LoadingData/LoadingData'
import { getStory, updateStory } from 'api/apiStory'
import { ChangeEventHandler, ClickEventHandler } from 'types/react'
import { useMutation } from 'react-query'
import { ErrorQuery } from 'types/params'

function EditStory(props: { url: string, onClickBackFromEditNovel: ClickEventHandler }) {
    const { url, onClickBackFromEditNovel } = props
    const [image, setImage] = useState<File>();
    const [preview, setPreview] = useState(avt)
    const [name, setName] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [tacgia, setTacgia] = useState<string>("");
    const [theloai, setTheloai] = useState<string>("");
    const [id, setId] = useState<string>("");
    const [loadingStory, setLoadingStory] = useState<boolean>(true)
    const [isUpdating, setIsUploading] = useState<boolean>(false)
    const types = ["Tiên hiệp", "Dã sử", "Kì ảo", "Kiếm hiệp", "Huyền huyễn", "Khoa huyễn"]

    const { mutate } = useMutation((params: any) => updateStory(params),
        {
            onSuccess() {
                toast.success("Sửa truyện thành công")
                setIsUploading(false)
            },
            onError(error: ErrorQuery) {
                toast.warning(error.response?.data?.details?.message)
                setIsUploading(false)
            }
        })

    useEffect(() => {
        const LoadStory = async () => {
            if (url) {
                getStory(url)
                    .then(res => {
                        setPreview(res.image)
                        setName(res.name)
                        setDescription(res.description)
                        setTheloai(res.type)
                        setTacgia(res.author)
                        setId(res._id)
                        setLoadingStory(false)
                    })
                    .finally(() => { setLoadingStory(false) })
            }
        }
        LoadStory()
    }, [url])


    const handleEdit: ClickEventHandler = async (e) => {
        e.preventDefault()
        setIsUploading(true)
        if (image) {
            const url = name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").split(' ').filter(i => i !== ' ').join('-').toLowerCase()
            const storageRef = ref(storage, `/images/truyen/${url}`);
            uploadBytes(storageRef, image).then((result) => {
                getDownloadURL(result.ref).then(async (urlImage) => {//lấy liên kết tới ảnh
                    const data = {
                        tentruyen: name,
                        hinhanh: urlImage,
                        noidung: description,
                        tacgia,
                        theloai,
                        url,
                        id,
                    }
                    mutate(data)
                })
            })
        }
        else if (preview) {
            const data = {
                tentruyen: name,
                hinhanh: preview,
                tacgia,
                theloai,
                url,
                id,
            }
            mutate(data)
        }
    }

    ///OnChange event
    const onChangeName: ChangeEventHandler = (e) => {
        setName(e.target.value)
    }

    const onChangeImage: ChangeEventHandler = (e) => {
        if (e.target.files)
            if (e.target.files.length !== 0) {
                setImage(e.target.files[0]);
                setPreview(URL.createObjectURL(e.target.files[0]))
            }
    }

    const labelStyle = { 'minWidth': '100px', 'display': 'inline-block' }
    return (
        <>
            {
                loadingStory ? <LoadingData />
                    :
                    <><span className='text-with-icon' onClick={onClickBackFromEditNovel}><i className='bx bx-left-arrow' ></i> Danh sách truyện</span>
                        <div className="profile__wrap row">
                            <div className="col-5 col-md-12 col-sm-12 story-img">

                                <img src={preview} alt="" />
                                <label className='btn-primary'>
                                    Chọn ảnh
                                    <input hidden type={"file"}
                                        accept=".jpg, .png, .jpeg, .gif, .bmp, .tif, .tiff|image/*"
                                        onChange={onChangeImage} />
                                </label>
                            </div>
                            <div className="col-7 col-md-12 col-sm-12 profile__main">
                                <form>
                                    <div className="group-info">
                                        <label htmlFor="" style={labelStyle}>Tên truyện</label>
                                        <input onChange={onChangeName} value={name || ""} />
                                    </div>
                                    <div className="group-info">
                                        <label htmlFor="" style={labelStyle}>Mô tả</label>
                                        <input onChange={e => { setDescription(e.target.value) }} value={description}></input>
                                    </div>
                                    <div className="group-info">
                                        <label style={labelStyle}>Tác giả</label>
                                        <input required onChange={e => { setTacgia(e.target.value) }} value={tacgia}></input>
                                    </div>
                                    <div className="group-info">
                                        <label htmlFor="types">Thể loại</label>
                                        <select style={labelStyle} onChange={e => { console.log(e.target.value); setTheloai(e.target.value) }} value={theloai} id="types" name="types">
                                            {
                                                types.map(item => { return (<option value={item}>{item}</option>) })
                                            }
                                        </select>
                                    </div>
                                    <div className="d-flex">
                                        <button onClick={handleEdit}>{isUpdating ? <Loading /> : ''} Sửa truyện</button>
                                    </div>
                                </form>
                            </div>
                        </div></>
            }</>

    )
}

export default EditStory;