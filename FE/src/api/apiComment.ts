import { Comment } from "models/Comment";
import { axiosClient, axiosClientWithToken } from "./axiosClient";
import getData from "./getData";

export const createComment = async (params: any) => {
  const url = `/comment`;
  return getData(await axiosClientWithToken.post(url, params));
};

export const getCommentsByUrl = async (
  url: string,
  params: any
): Promise<Comment[]> => {
  return getData(await axiosClient.get(`/comment/${url}`, { params }));
};

export const deleteComment = async (params: any) => {
  const url = `/comment`;
  return getData(await axiosClientWithToken.delete(url, { params }));
};

export const getListCommentByNovelId = async (novelId: string) => {
    const res = await axiosClientWithToken.get(`/admin/comments/novel/${novelId}`);
    return getData(res);
};

export const getAllComments = async () => {
    const response = await axiosClientWithToken.get('/comment/getlistcomments ');
    return response.data;
  };

export const deleteCommentById = async (id: string) => {
  return getData(
    await axiosClientWithToken.delete(`/admin/comment`, { params: { id } })
  );
};
