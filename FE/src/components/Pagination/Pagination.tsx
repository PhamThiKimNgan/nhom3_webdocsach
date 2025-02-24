import { useEffect, useState } from 'react'
import './Pagination.scss'
import { ClickEventHandler } from 'types/react'
type PaginationProps = {
    totalPage: number,
    currentPage: number,
    handleSetPage: Function
}
function Pagination({ totalPage, currentPage, handleSetPage }: PaginationProps) {//Component phân trang
    const [item, setItem] = useState<(string | number)[]>([])


    useEffect(() => {//Xử lý hiển thị số trang 
        pagination(currentPage, totalPage)
    }, [currentPage, totalPage])



    function pagination(currentPage: number, totalPage: number) {
        let temp: (string | number)[] = [];
        try {

            let i = 1 //bắt đầu từ trang 1
            if (totalPage > 0) {
                if (totalPage < 8) { //Nếu <8 trang thì hiển thị dạng 1 2 3 4 5 6 7 8
                    temp = (new Array(totalPage)).fill(0).map(() => { return i++; }) //tạo array [1,2,3,4,5,6,7,8]
                }
                else {//trường hợp hơn 8 trang
                    if (currentPage < 5) { //Nếu trang hiện tại <5 hiển thị dạng 1 2 3 4 5 ... totalPage
                        temp = [1, 2, 3, 4, 5]
                        temp.concat(['...', totalPage]);//
                    }
                    else if (currentPage > (totalPage - 4)) { //Nếu lớn hơn totalPage - 4 trang, hiển thị dạng 1 ... tp-3,tp-2,tp-1 ,tp
                        i = totalPage - 5 + 1
                        temp = [1, '...'].concat((new Array(5)).fill(0).map(() => { return i++; }))
                    }
                    else { //trường hợp còn lại, ví dụ currentPage = 6 hiển thị dạng 1 ... 5 6 7 ... totalPage
                        temp = [1, '...'].concat([currentPage - 1, currentPage, currentPage + 1]).concat(['...', totalPage])
                    }
                }
            }
            setItem(temp)
        }
        catch (err) {
            setItem([])
        }

    }


    const onClickPage: ClickEventHandler = (e) => {//xử lý đổi trang
        if (Number(e.currentTarget.ariaValueText))
            handleSetPage(Number(e.currentTarget.ariaValueText))
    }

    const onClickPre = () => {//xử lý next
        if (currentPage)
            handleSetPage(currentPage - 1 < 1 ? 1 : currentPage - 1)
    }
    const onClickNext = () => {//xử lý previous
        if (currentPage)
            handleSetPage(currentPage + 1 > totalPage ? totalPage : currentPage + 1)
    }

    return (
        <div className='d-flex' style={{ "margin": "20px auto", "justifyContent": "center" }}>
            <button onClick={onClickPre} className={`btn-pagination btn-pagination__page `} ><i className='bx bx-chevron-left fs-28'></i></button>
            {
                item.map((page, index) => {
                    return <button aria-valuetext={page.toString()}
                        onClick={onClickPage}
                        className={`btn-pagination ${page !== '...' ? 'btn-pagination__page' : ''} ${currentPage === page ? 'page-active' : ''}`}
                        key={index}>{page}
                    </button>
                })
            }
            <button onClick={onClickNext} className={`btn-pagination btn-pagination__page`} ><i className='bx bx-chevron-right fs-28'></i></button>
        </div>
    )
}

export default Pagination
