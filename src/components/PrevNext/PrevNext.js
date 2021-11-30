import './PrevNext.scss';

import Element from '../Element/Element';
import { Link } from 'gatsby';
import { PropTypes } from 'prop-types';
import React from 'react';
import navigation from '../../content/partnavigation/partnavigation';
import snakeCase from 'lodash/fp/snakeCase';
import { useTranslation } from 'react-i18next';
import getTranslationPath from '../../utils/getTranslationPath';

const prevChar = c => String.fromCharCode(c.charCodeAt(0) - 1);
const nextChar = c => String.fromCharCode(c.charCodeAt(0) + 1);
// TODO change on release
const hasPart = (part, lang) =>
  Object.keys(navigation[lang]).includes(part.toString());
const nextLetterExists = (letter, part, lang) =>
  nextChar(letter) in navigation[lang][part];
const hasNext = (letter, part, lang) => {
  return (
    (!letter && hasPart(part + 1, lang)) ||
    (letter && nextLetterExists(letter, part, lang))
  );
};

const labelOsaPart = lang => (lang === 'fi' ? 'Osa' : 'Part');

const langUrl = lang => (lang === 'fi' ? '/osa' : `/${lang}/part`);

const PrevNext = ({ part, letter, lang }) => {
  const { t } = useTranslation();

  const getPrev = () => {
    if (!letter && hasPart(part - 1, lang)) {
      return (
        <>
          <Link
            to={`${langUrl(lang)}${part - 1}`}
            className="col-4--mobile push-right-1 prev"
          >
            <Element flex dirColumn>
              <p>
                {labelOsaPart(lang)} {part - 1}
              </p>

              <b>{t('previousPart')}</b>
            </Element>
          </Link>

          {hasNext(letter, part, lang) && (
            <div className="col-1--mobile separator" />
          )}
        </>
      );
    } else if (letter) {
      if (letter !== 'a') {
        return (
          <>
            <Link
              to={`${langUrl(lang)}${part}/${snakeCase(
                navigation[lang][part][prevChar(letter)]
              )}`}
              className="col-4--mobile push-right-1 prev"
            >
              <Element flex dirColumn>
                <p>
                  {labelOsaPart(lang)} {`${part}${prevChar(letter)}`}
                </p>

                <b>{t('previousPart')}</b>
              </Element>
            </Link>

            {hasNext(letter, part, lang) && (
              <div className="col-1--mobile separator" />
            )}
          </>
        );
      } else if (hasPart(part - 1, lang)) {
        return (
          <>
            <Link
              to={`${langUrl(lang)}${part - 1}`}
              className="col-4--mobile push-right-1 prev"
            >
              <Element flex dirColumn>
                <p>
                  {labelOsaPart(lang)} {part - 1}
                </p>

                <b>{t('previousPart')}</b>
              </Element>
            </Link>

            {hasNext(letter, part, lang) && (
              <div className="col-1--mobile separator" />
            )}
          </>
        );
      } else {
        return <Element className="push-right-1" />;
      }
    } else {
      return <Element className="push-right-1" />;
    }
  };

  const getNext = () => {
    if (!letter && hasPart(part + 1, lang)) {
      console.log('a', hasPart(part + 1, lang))
      return (
        <Link
          to={`${langUrl(lang)}${part + 1}`}
          className="col-4--mobile push-left-1 next"
        >
          <Element flex dirColumn>
            <p>
              {labelOsaPart(lang)} {part + 1}
            </p>

            <b>{t('nextPart')}</b>
          </Element>
        </Link>
      );
    } else if (letter) {
      if (nextLetterExists(letter, part, lang)) {
        return (
          <Link
            to={`${langUrl(lang)}${part}/${snakeCase(
              navigation[lang][part][nextChar(letter)]
            )}`}
            className="col-4--mobile push-left-1 next"
          >
            <Element flex dirColumn>
              <p>
                {labelOsaPart(lang)} {`${part}${nextChar(letter)}`}
              </p>

              <b>{t('nextPart')}</b>
            </Element>
          </Link>
        );
      } else if (hasPart(part + 1, lang)) {
        return (
          <Link
            to={`${langUrl(lang)}${part + 1}`}
            className="col-4--mobile push-left-1 next"
          >
            <Element flex dirColumn>
              <p>
                {labelOsaPart(lang)} {part + 1}
              </p>

              <b>{t('nextPart')}</b>
            </Element>
          </Link>
        );
      } else {
        return <Element className="push-left-1" />;
      }
    } else {
      return <Element className="push-left-1" />;
    }
  };

  return (
    <Element className="container spacing spacing--after-large prev-next__container">
      {getPrev()}

      {getNext()}
    </Element>
  );
};

PrevNext.defaultProps = {
  part: undefined,
  letter: undefined,
};

PrevNext.propTypes = {
  part: PropTypes.number,
  letter: PropTypes.string,
  lang: PropTypes.string.isRequired,
};

export default PrevNext;
