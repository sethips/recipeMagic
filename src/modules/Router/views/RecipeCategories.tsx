import { categories } from 'const';
import { FILTERS_TYPES } from 'modules/Filters/redux/types';
import { useDispatch } from 'react-redux';
import React, { useCallback, useLayoutEffect } from 'react';
import { useSearch } from 'hooks';
import { Search } from 'modules';
import anime from 'animejs';
import { LazyImage } from 'components';
import { withRouter } from 'react-router';

const RecipeCategories = ({ history }: any) => {
  const dispatch = useDispatch();

  const fadeIn = () => {
    const fadeIn = anime.timeline();
    fadeIn
      .add({
        targets: '.main',
        opacity: [0, 1],
        duration: 300,
        easing: 'easeInQuad'
      })
      .add(
        {
          targets: '.recipeCategories__heroBackground',
          opacity: [0, 0.6],
          translateX: ['-100%', 0],
          duration: 500,
          easing: 'easeInQuad'
        },
        '-=300'
      )
      .add(
        {
          targets: '.recipeCategories__heroContent > *',
          opacity: [0, 1],
          translateY: ['-15%', 0],
          duration: 400,
          delay: (el, i, l) => i * 300,
          easing: 'easeInQuad'
        },
        '-=200'
      )
      .add(
        {
          targets: '.recipeCategories__wrapper',
          opacity: [0, 1],
          duration: 500,
          translateY: ['2%', 0],
          delay: (el, i, l) => i * 150,
          easing: 'easeInQuad'
        },
        '-=100'
      );
  };

  useLayoutEffect(() => {
    fadeIn();
  }, []);

  const handleSearchSubmit = useCallback(async (query: string) => {
    await dispatch({ type: FILTERS_TYPES.FILTERS_RESET });
    await dispatch({
      type: FILTERS_TYPES.FILTERS_ADD,
      payload: { key: 'searchQuery', data: query || '' }
    });
    if (query) await history.push('/recipes/list');
  }, []);

  const [state, api] = useSearch(handleSearchSubmit);

  return (
    <section className="recipeCategories">
      <article className="recipeCategories__hero">
        <div className="recipeCategories__heroContent container container--withPadding">
          <h2 className="heading heading--level2 recipeCategories__heroTitle">
            Search through 1.7+ million recipes
          </h2>
          <Search {...state} {...api} />
        </div>
        <div className="recipeCategories__heroBackground"></div>
      </article>
      <div className="container container--withPadding">
        {categories.map(({ items, title, key }: any) => (
          <article className="recipeCategories__wrapper">
            <h2 className="heading heading--level2 recipeCategories__title">
              <span>{title}</span>
            </h2>
            <ul className="recipeCategories__list">
              {items.map(({ category, image, data }: any) => (
                <li key={data}>
                  <button
                    className="recipeCategories__link"
                    onClick={() => {
                      dispatch({ type: FILTERS_TYPES.FILTERS_RESET });
                      dispatch({
                        type: FILTERS_TYPES.FILTERS_ADD,
                        payload: { key, data }
                      });
                      history.push('/recipes/list');
                    }}
                  >
                    <LazyImage
                      className="recipeCategories__image"
                      src={image}
                    ></LazyImage>
                    <h3 className="heading heading--level4">{category}</h3>
                  </button>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
};

export default withRouter(RecipeCategories);