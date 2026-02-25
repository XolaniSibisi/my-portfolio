import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Container, Col, Row } from 'react-bootstrap';
import PropTypes from 'prop-types';
import Fade from 'react-awesome-reveal';
import Header from './Header';
import endpoints from '../constants/endpoints';
import FallbackSpinner from './FallbackSpinner';

const styles = {
  introTextContainer: {
    margin: 10,
    whiteSpace: 'pre-wrap',
    textAlign: 'left',
    fontSize: '1.1em',
    fontWeight: 500,
  },
  introImageContainer: {
    maxWidth: '100%',
    height: 'auto',
    objectFit: 'cover',
    borderRadius: 8,
  },
};

function About(props) {
  const { header } = props;
  const [data, setData] = useState(null);

  const parseIntro = (text) => (
    <ReactMarkdown
      children={text}
    />
  );

  useEffect(() => {
    fetch(endpoints.about, {
      method: 'GET',
    })
      .then((res) => res.json())
      .then((res) => setData(res))
      .catch((err) => {
        console.error('Error fetching about data:', err);
        setData({ about: '', imageSource: '' });
      });
  }, []);

  return (
    <>
      <Header title={header} />
      <div className="section-content-container">
        <Container>
          {data
            ? (
              <Fade triggerOnce>
                <Row className="align-items-center gy-4 flex-column flex-md-row">
                  <Col className="col-12 col-md-7" style={styles.introTextContainer}>
                    {data?.about ? parseIntro(data.about) : null}
                  </Col>
                  <Col className="col-12 col-md-5 col-lg-4" style={styles.introImageContainer}>
                    {data?.imageSource ? <img src={data?.imageSource} alt="profile" className="img-fluid" style={styles.introImageContainer} loading="lazy" /> : null}
                  </Col>
                </Row>
              </Fade>
            )
            : <FallbackSpinner />}
        </Container>
      </div>
    </>
  );
}

About.propTypes = {
  header: PropTypes.string.isRequired,
};

export default About;
