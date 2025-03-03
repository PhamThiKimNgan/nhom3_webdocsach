import React, { useEffect, useState } from "react";
import { getNovels } from "../../api/apiStory";
import { Story } from "../../models/Story";
import Section, {
  SectionHeading,
  SectionBody,
} from "../../components/Section/Section";
import StoryItem from "components/StoryItem/StoryItem";
import Layout from "../../components/Layout/Layout";
import Pagination from "../../components/Pagination/Pagination";

// Define interface for story data
interface StoryData extends Omit<Story, "id"> {
  id: string;
  title: string;
  // Add other fields based on your actual story structure
  [key: string]: any;
}

// Define pagination params interface
interface PaginationParams {
  page: number;
  size: number;
}

function AllStory(): JSX.Element {
  const [datas, setDatas] = useState<StoryData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 20;

  useEffect(() => {
    const loadData = async (): Promise<void> => {
      setLoading(true);
      try {
        const response = await getNovels({
          page: currentPage - 1, // API typically uses 0-based indexing
          size: itemsPerPage,
        } as PaginationParams);

        if (response) {
          setDatas(
            response.map((item) => ({
              ...item,
              id: String(item.id) || "",
              title: item.title || "",
            }))
          );
          // Assuming the API returns total pages info, adjust accordingly
          setTotalPages(Math.ceil(response.length / itemsPerPage));
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [currentPage]); // Add currentPage as dependency

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0); // Scroll to top when page changes
  };

  return (
    <>
      <Layout>
        <div className="main-content">
          <div className="d-flex">
            <Section>
              <SectionHeading>
                <h4 className="section-title">Tất cả</h4>
              </SectionHeading>
              <SectionBody>
                <div className="list-story">
                  {loading ? (
                    <div>Loading...</div>
                  ) : (
                    datas.map((data, index) => (
                      <StoryItem key={data.id || index} data={data} />
                    ))
                  )}
                </div>
                {totalPages > 1 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPage={totalPages}
                    handleSetPage={handlePageChange}
                  />
                )}
              </SectionBody>
            </Section>
          </div>
        </div>
      </Layout>
    </>
  );
}

export default AllStory;
