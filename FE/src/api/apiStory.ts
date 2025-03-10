import { Story } from "models/Story";
import { axiosClient, axiosClientWithToken } from "./axiosClient";
import getData from "./getData";
import { Rating } from "models/Rating";
import { Chapter } from "models/Chapter";
import { Reading } from "models/Reading";
export const getStories = async (params: any): Promise<Story[]> => {
  const res = getData(await axiosClient.get<never>(`/novels`, { params }));
  return res;
};

export const getStoriesTopRating = async (params: any): Promise<Story[]> => {
  const res = getData(
    await axiosClient.get<never>(`novels/novel-toprating`, { params })
  );
  return res;
};

export const getStoriesByName = async (params: any): Promise<Story[]> => {
  const res = await axiosClient.get(`/novels/search`, { params: params });
  return getData(res);
};

export const getReadings = async (): Promise<Reading[]> => {
  const url = `/novels/readings`;
  return getData(await axiosClientWithToken.get(url));
};

export const getReadingDefault = async (params: any): Promise<Reading[]> => {
  const url = `/novels/readingsdefault`;
  return getData(await axiosClient.get(url, { params }));
};

export const getChapterNewUpdate = async (params: any) => {
  return getData(await axiosClient.get(`/novels/novel/newupdate`, { params }));
};

export const getNameChapters = async (
  url: string,
  params: any
): Promise<Chapter[]> => {
  const res = await axiosClientWithToken.get(`/novels/novel/${url}/mucluc`, {
    params,
  });
  return getData(res);
};
export const getChapters = async (
  url: string,
  params: any
): Promise<Chapter[]> => {
  const res = await axiosClientWithToken.get(`/novels/novel/${url}/chuong`, {
    params,
  });
  return getData(res);
};

export const getChapterByNumber = async (
  tentruyen: string | undefined,
  chapnum: string | number
): Promise<Chapter> => {
  return getData(
    await axiosClientWithToken.get(
      `/novels/novel/${tentruyen}/chuong/${chapnum}`
    )
  );
};

export const getNovelById = async (id: string): Promise<Story> => {
  return getData(await axiosClient.get(`/novels/${id}`));
};

export const getStory = async (url: string): Promise<Story> => {
  const res = await axiosClient.get(`/novels/novel/${url}`);
  return getData(res);
};

export const createRating = async (params: any) => {
  const url = `/rating`;
  return getData(await axiosClientWithToken.post(url, params));
};

export const getRatingsByUrl = async (
  url: string,
  params: any
): Promise<Rating[]> => {
  return getData(await axiosClientWithToken.get(`/rating/${url}`, { params }));
};

export const deleteRating = async (params: any) => {
  return getData(await axiosClientWithToken.delete(`/rating/`, { params }));
};

export const createStory = async (params: any) => {
  const url = `/novels/novel/create`;
  return (await axiosClientWithToken.post(url, params)).data;
};
export const updateStory = async (params: any) => {
  const url = `/novels/novel/edit`;
  return getData(await axiosClientWithToken.put(url, params));
};
export const deleteStory = async (params: any) => {
  const url = `/novels/novel`;
  return getData(await axiosClientWithToken.delete(url, { params }));
};

export const getStoriesByUsername = async (params: any): Promise<Story[]> => {
  const res = await axiosClientWithToken.get(`/novels/created`, { params });
  return getData(res);
};

export const deleteNovelById = async (id: string) => {
  return getData(
    await axiosClientWithToken.delete(`/admin/novel`, { params: { id } })
  );
};

export const deleteNovelByUrl = async (url: string) => {
  return getData(
    await axiosClientWithToken.delete(`/admin/novel`, { params: { url } })
  );
};
export const getNovels = async (params: any): Promise<Story[]> => {
  return getData(await axiosClientWithToken.get(`/novels`, { params }));
};

export const getNovelReviewById = async (id: string) => {
  return getData(
    await axiosClientWithToken.post(`/admin/novel/review/id`, { id })
  );
};

export const getChaptersByNovelId = async (novelId: string) => {
  return getData(
    await axiosClientWithToken.get(`/novels/${novelId}/chapters`)
  );
};

export const getListCommentByNovelId = async (novelId: string) => {
  return getData(
    await axiosClientWithToken.get(`/admin/comments/novel/${novelId}`)
  );
};

export const getListRatingByNovelId = async (novelId: string) => {
  return getData(
    await axiosClientWithToken.get(`/admin/ratings/novel/${novelId}`)
  );
};

export const createStoryWithChapters = async (params: {
  story: Partial<Story>;
  chapters: Partial<Chapter>[];
}) => {
  const url = `/novels/novel/create-with-chapters`;
  return getData(await axiosClientWithToken.post(url, params));
};

export const updateStoryWithChapters = async (params: {
  story: Partial<Story>;
  chapters: Partial<Chapter>[];
}) => {
  const url = `/novels/novel/update-with-chapters`;
  return getData(await axiosClientWithToken.put(url, params));
};


/// get novel top rating http://localhost:5000/api/novels/novel-toprating
export const getNovelTopRating = async (params: any): Promise<Story[]> => {
  const res = await axiosClient.get(`/novels/novel-toprating`, { params: params });
  return getData(res);
}


