import mongoose from "mongoose";
import { Novel } from "../models/Novel.js";
import { Chapter } from "../models/Chapter.js";

import { ResponseDetail, ResponseData } from "../services/ResponseJSON.js";
export const NovelController = {
  GetNovelById: async (req, res) => {
    const novelId = req.params.id;
    //kiểm tra kiểu dữ liệu của id truyện có hợp lệ không
    if (!mongoose.Types.ObjectId.isValid(novelId)) {
      return res
        .status(400)
        .json(ResponseDetail(400, { message: "ID truyện không hợp lệ" }));
    }

    const novel = await Novel.findById(novelId);
    if (novel == null) {
      return res
        .status(400)
        .json(ResponseDetail(400, { message: "Không tìm thấy truyện" }));
    }
    return res.status(200).json(ResponseData(200, novel));
  },

  GetNovels: (req, res) => {
    try {
      const status = req.query.status || "None";
      const sort = req.query.sort || "tentruyen";
      const page = parseInt(req.query.page) || 0;
      const size = parseInt(req.query.size) || 6;
      //lấy giá trị lớn hơn
      //tránh số trang xuống âm
      const validPage = Math.max(0, page);
      Novel.find()
        .limit(size) // giới hạn số lượng phần tử mỗi trang
        .skip(size * validPage) //bỏ quasố lượng phần tử ở mỗi trang trước để phân trang cho trang sau( trang 1 : bỏ qua 6*0 = 0 phần tử
        //     trang2 : bỏ qua 6* 1 = 6 phần tử)
        .sort({ name: -1 }) // sắp xếp theo tên thứ tự giảm dần
        .then((result) => {
          res.status(200).json(ResponseData(200, result));
        })
        .catch((err) => {
          console.log(err);
          res
            .status(500)
            .json(ResponseDetail(500, { message: "Lỗi GetNovels" }));
        });
    } catch (error) {
      console.log(error);
      res.status(500).json(ResponseDetail(500, { message: "Lỗi GetNovels" }));
    }
  },

  GetNovelsTopRating: (req, res) => {
    try {
      const status = req.query.status || "None";
      const sort = req.query.sort || "tentruyen";
      const page = req.query.page - 1 || 0;
      const size = req.query.size || 6;
      Novel.find()
        .limit(size)
        .skip(size * page)
        .sort({ rating: -1 })
        .then((result) => {
          res.status(200).json(ResponseData(200, result));
        })
        .catch((err) => {
          console.log(err);
          res
            .status(500)
            .json(ResponseDetail(500, { message: "Lỗi GetNovels" }));
        });
    } catch (error) {
      console.log(error);
      res.status(500).json(ResponseDetail(500, { message: "Lỗi GetNovels" }));
    }
  },

  GetReadingsDefault: async (req, res) => {
    try {
      console.log(req.query);
      const page = parseInt(req.query.page) || 0;
      const size = parseInt(req.query.size) || 10;

      const validPage = Math.max(0, page);
      // lấy theo cập nhật gần nhất
      const novels = await Novel.find().limit(size).sort({ updatedAt: -1 });

      const novelReadings = await Promise.all(
        novels.map(async (item) => {
          // lấy số lượng chap theo novelId
          const chapterCount = await Chapter.countDocuments({
            novelId: item._id,
          });
          return {
            name: item.name,
            image: item.image,
            chapternumber: 0,
            url: item.url,
            sochap: chapterCount,
          };
        })
      );

      return res.status(200).json(ResponseData(200, novelReadings));
    } catch (err) {
      console.log(err);
      return res
        .status(500)
        .json(ResponseDetail(500, { message: "Lỗi lấy thông tin truyện" }));
    }
  },

  GetNewestChapter: async (req, res) => {
    try {
      const page = req.query.page || 0;
      const size = req.query.size || 10;
      let chaps = await Chapter.find()
        .populate({
          // lấy lên toàn bộ truyện chứa chapter này
          path: "novelId",
          // lấy toàn bộ thông tin uploader trong novel này
          populate: {
            path: "uploader",
          },
        })
        .limit(size)
        .sort({ updatedAt: -1 });
      // lọc trả về đối tượng json chứa các trường cần thiết cho view Mới cập nhật
      chaps = chaps
        .filter((item) => item.novelId != null)
        .map((item) => {
          return {
            type: item.novelId.type,
            name: item.novelId.name,
            chaptername: item.chaptername,
            author: item.novelId.author,
            uploader: item.novelId.uploader?.nickname,
            updatedAt: item.updatedAt,
            url: item.novelId.url,
            chapternumber: item.chapternumber,
          };
        });
      if (chaps) {
        return res.status(200).json(ResponseData(200, chaps));
      }
      return res.status(200).json(ResponseData(200, []));
    } catch (err) {
      console.log(err);
      return res
        .status(500)
        .json(ResponseDetail(500, { message: "Lỗi lấy thông tin chap" }));
    }
  },

  GetNovelsByUrl: async (req, res) => {
    try {
      const url = req.params.url;
      const novel = await Novel.findOne({ url: url });
      if (novel == null) {
        return res
          .status(400)
          .json(ResponseDetail(400, "Lỗi không tìm thấy dữ liệu"));
      }
      return res.status(200).json(ResponseData(200, novel));
    } catch (error) {
      console.log(err);
      return res
        .status(500)
        .json(ResponseDetail(500, { message: "Lỗi lấy thông tin chap" }));
    }
  },
  GetChapterByNumber: async (req, res) => {
    try {
      const url = req.params.url;
      const chapNumber = req.params.chapNumber;
      const novel = await Novel.findOne({ url: url });
      const chapterByNovel = await Chapter.findOne({
        novelId: novel._id,
        chapternumber: chapNumber,
      });
      if (!chapterByNovel) {
        return res
          .status(400)
          .json(ResponseDetail(400, "Lỗi không tìm thấy dữ liệu1"));
      }
      return res.status(200).json(ResponseData(200, chapterByNovel));
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json(ResponseDetail(500, { message: "Lỗi lấy thông tin chap" }));
    }
  },
  SearchNovelByName: async (req, res) => {
    try {
        let search = req.query.search
        if (!search) {
            return res.status(500).json(ResponseDetail(500, { message: "Thiếu field" }))
        }
        search = search.normalize("NFD").toLowerCase().replace(/[\u0300-\u036f]/g, "").replace(/[\u0300-\u036f]/g, "").split(' ').filter(i => i !== '').join(' ')
        const novels = await Novel.find({ $text: { $search: search } })
        if (novels) {
            return res.status(200).json(ResponseData(200, novels))
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json(ResponseDetail(500, { message: "Lỗi tìm truyện" }))
    }
},
  // SearchNovelByName: async (req, res) => {
  //   try {
  //     const search = req.query.search;
  //     console.log(search)
  //     if (!search) {
  //       return res
  //         .status(400)
  //         .json({ message: "Vui lòng nhập tên tiểu thuyết để tìm kiếm." });
  //     }
  //     const novels = await Novel.find({
  //       name: { $regex: search, $options: "i" }, // tìm kiếm khớp 1 phần không phân biệt chữ hoa chứ thường
  //     });
  //     if (!novels) {
  //       return res
  //         .status(404)
  //         .json({ message: "Không tìm thấy tiểu thuyết nào." });
  //     }
  //     return res.status(200).json(ResponseData(200, novels));
  //   } catch (error) {
  //     console.log(error);
  //     return res
  //       .status(500)
  //       .json(ResponseDetail(500, { message: "Lỗi lấy thông tin chap" }));
  //   }
  // },

  // đang đọc nếu người dùng đăng nhập
  GetReadings: (req, res) => {
    try {
    } catch (error) {
      console.log(error);
      res.status(500).json(ResponseDetail(500, { message: "Lỗi GetNovels" }));
    }
  },
};
