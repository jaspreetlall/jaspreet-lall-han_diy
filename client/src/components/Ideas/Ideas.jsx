import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import './Ideas.scss';
import EditIcon from '../../assets/icons/edit-white-48dp.svg';
import ViewIcon from '../../assets/icons/view-white-48dp.svg';
import fire from '../../Firebase/Fire';

function Ideas({userId}) {
  // Setting page title
  useEffect(() => {
    document.title = `Han-DIY | Saved ideas`;
  }, []);

  // Storing all ideas from firestore
  const [ ideaArray, setIdeaArray ] = useState([]);
  // Filter string to filter ideas by category
  const [ ideaFilter, setIdeaFilter ] = useState('All');
  // Array of categories(from ideas received from api)
  const [ categories, setCategories ] = useState([]);

  useEffect(() => {
    const fetchData = fire
    .firestore()
    .collection("ideas")
    .onSnapshot((querySnapshot) => {
      let ideaArrayFromResults = [];
      let categoriesFromResults = [];
      // For each document (idea) received,
      // pushing the idea into ideaArrayFromResults,
      // pushing category into categoriesFromResults
      querySnapshot.forEach((idea) => {
        ideaArrayFromResults.push({id: idea.id, ...idea.data()});
      })
      // Setting states for ideaArray and categories
      // when no filter is set by the user
      if (ideaFilter === "All") {
        // Setting ideaArray state with ideas
        setIdeaArray(
          ideaArrayFromResults
          // that belong to the current userId
          .filter(idea => idea.userId === userId)
          // while sorting with respect to the timestamp
          .sort((a,b) => b.timestamp - a.timestamp)
        );
        // Getting categories from the ideas
        ideaArrayFromResults.forEach((idea) => {
          // that belong to the current userId
          if (idea.userId === userId) {
            categoriesFromResults.push(idea.category);
          }
        });
        // and setting those into state after removing
        // using [...new Set()]
        setCategories([...new Set(categoriesFromResults)]);
      } else {
        // Setting ideaArray state with ideas
        // when filter is set by the user
        setIdeaArray(
          ideaArrayFromResults
          // that belong to the current userId && pass the category filter
          .filter(idea => idea.userId === userId && idea.category === ideaFilter)
          // while sorting with respect to the timestamp
          .sort((a,b) => b.timestamp - a.timestamp)
        );
        // Getting categories from the ideas
        ideaArrayFromResults.forEach((idea) => {
          // that belong to the current userId && pass the category filter
          if (idea.userId === userId && idea.userId === userId) {
            categoriesFromResults.push(idea.category);
          }
        });
        // and setting those into state after removing
        // using [...new Set()]
        setCategories([...new Set(categoriesFromResults)]);
      }
    }, (err) => console.log(err))
    return () => fetchData();
  }, [ideaFilter, userId])

  // Function to toggle classes on Category filter
  // buttons depending on current filter set
  const toggleCategoryButtonClass = (filterTerm) => {
    if(ideaFilter === filterTerm) {
      return ("ideas__block-categories-filter-button ideas__block-categories-filter-button--current")
    } else {
      return ("ideas__block-categories-filter-button")
    }
  }

  // Function to toggle classes on idea status
  // spans depending whether or not the idea is completed
  const toggleIdeaStatusClass = (doneStatus) => {
    if(doneStatus) {
      return ("ideas__block-card-info-status ideas__block-card-info-status--complete")
    } else {
      return ("ideas__block-card-info-status")
    }
  }

  // Check if the array has been loaded into the state
  if (ideaArray.length !== 0) {
    return (
      <section className="ideas">
        <div className="ideas__block container">
          <h2 className="ideas__block-title">Saved ideas</h2>
          <div className="ideas__block-categories">
            <h3 className="ideas__block-categories-title">Categories</h3>
            <div className="ideas__block-categories-filter">
              <button
                className={toggleCategoryButtonClass("All")}
                onClick={() => setIdeaFilter("All")}>All
              </button>
              {/* // Creating filter buttons from available categories */}
              {categories.map((category, index) => {
                return (
                  <button
                    className={toggleCategoryButtonClass(category)}
                    key={index}
                    onClick={() => setIdeaFilter(category)}>{category}
                  </button>
                )
              })}
            </div>
          </div>
          {/* Rendering card per idea from ideaArray */}
          {ideaArray.map((idea) => {
            return (
              <div
                className="ideas__block-card"
                key={idea.id}
                style={{
                  background: `linear-gradient(270deg, #ffffff 55%, rgba(255, 255, 255, 0) 100%), url(${idea.imageUrl})`,
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "cover",
                  backgroundPosition: "center"
                }}
              >
                <div className="ideas__block-card-info">
                  <h3 className="ideas__block-card-info-title">{idea.title}</h3>
                  <span
                    // Toggling classes based on idea status
                    // Dynamic value for status based on idea status
                    // -- true => completed idea
                    // -- false => pending idea
                    className={toggleIdeaStatusClass(idea.done)}
                    >{(idea.done) ? "Completed" : "Pending"}
                  </span>
                </div>
                <div className="ideas__block-card-links">
                  <Link className="ideas__block-card-links-icon" to={`/idea/${idea.id}/edit`}>
                    <img className="ideas__block-card-links-icon-img" src={EditIcon} alt="Edit icon"/>
                  </Link>
                  <Link className="ideas__block-card-links-icon ideas__block-card-links-icon--view" to={`/idea/${idea.id}/details`}>
                    <img className="ideas__block-card-links-icon-img" src={ViewIcon} alt="View icon"/>
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      </section>
    )
  } else {
    return (
      <section className="ideas">
        <div className="ideas__block container">
          <h2 className="ideas__block-title">Loading ideas...</h2>
          <div
            className="ideas__block-card"
            style={{
              background: `linear-gradient(270deg, #ffffff 55%, rgba(255, 255, 255, 0) 100%), url("https://unsplash.com/photos/_Yc7OtfFn-0/download?force=true&w=640")`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              backgroundPosition: "center"
            }}
          >
            <div className="ideas__block-card-info">
              <h3 className="ideas__block-card-info-title">+ Create to begin</h3>
              <span className="ideas__block-card-info-status ideas__block-card-info-status--complete">Your saved ideas will be displayed here.</span>
            </div>
          </div>
        </div>
      </section>
    )
  }
}

export default Ideas