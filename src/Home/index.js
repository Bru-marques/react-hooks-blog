import { useCallback, useState, useEffect } from "react";
import "./style.css";

import { loadPosts } from "../util/loadPosts";
import { Posts } from "../components/Posts";
import { TextInput } from "../components/TextInput";
import { Button } from "../components/Button";

export const Home = () => {
  const [posts, setPosts] = useState([]);
  const [allPosts, setAllPosts] = useState([]);
  const [page, setPage] = useState(0);
  const [postsPerPage] = useState(4);
  const [searchValue, setSearchValue] = useState("");

  const handleLoadPosts = useCallback(async (page, postsPerPage) => {
    const postsAndPhoto = await loadPosts();

    setPosts(postsAndPhoto.slice(page, postsPerPage));
    setAllPosts(postsAndPhoto);
  }, []);

  useEffect(() => {
    console.log(new Date().toLocaleString("pt-BR"));
    handleLoadPosts(0, postsPerPage);
  }, [handleLoadPosts, postsPerPage]);

  const loadMorePosts = () => {
    const nextPage = page + postsPerPage;
    const nextPosts = allPosts.slice(nextPage, nextPage + postsPerPage);
    posts.push(...nextPosts);

    setPosts(posts);
    setPage(nextPage);
  };

  const handleChange = (e) => {
    const { value } = e.target;
    setSearchValue(value);
  };

  const noMorePosts = page + postsPerPage >= allPosts.length;
  const filteredPosts = !!searchValue
    ? allPosts.filter((post) => {
        return post.title.toLowerCase().includes(searchValue.toLowerCase());
      })
    : posts;

  return (
    <section className="container">
      <div className="search-container">
        {!!searchValue && <h1>Search value: {searchValue}</h1>}
        <TextInput searchValue={searchValue} handleChange={handleChange} />

        {filteredPosts.length > 0 && <Posts posts={filteredPosts} />}
        {filteredPosts.length === 0 && <p>No posts =(</p>}

        <div className="button-container">
          {!searchValue && (
            <Button
              text="Load more posts"
              onClick={loadMorePosts}
              disabled={noMorePosts}
            />
          )}
        </div>
      </div>
    </section>
  );
};
