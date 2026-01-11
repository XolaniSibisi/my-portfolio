import React, { useEffect, useState, useContext } from 'react';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import { Container } from 'react-bootstrap';
import ReactMarkdown from 'react-markdown';
import PropTypes from 'prop-types';
import { ThemeContext } from 'styled-components';
import Fade from 'react-awesome-reveal';
import Header from './Header';
import endpoints from '../constants/endpoints';
import FallbackSpinner from './FallbackSpinner';
import '../css/experience.css';

const styles = {
  ulStyle: {
    listStylePosition: 'outside',
    paddingLeft: 20,
    marginTop: 8,
    marginBottom: 0,
  },
  subtitleContainerStyle: {
    marginTop: 10,
    marginBottom: 10,
  },
  subtitleStyle: {
    display: 'inline-block',
    margin: 0,
  },
  inlineChild: {
    display: 'inline-block',
    margin: 0,
    color: '#6b7280', // neutral grey
    fontWeight: 500,
  },
  itemTitle: {
    marginTop: 0,
    marginBottom: 6,
    fontSize: '1.5rem',
    fontWeight: 700,
  },
};

const makePointKey = (parentKey, point) => {
  const safe = String(point).trim().replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-]/g, '');
  const slice = safe.length ? safe.slice(0, 50) : 'point';
  return `${parentKey}-${slice}`;
};

function Experience(props) {
  const theme = useContext(ThemeContext);
  const { header } = props;
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(endpoints.experiences, { method: 'GET' })
      .then((res) => res.json())
      .then((res) => setData(res.experiences))
      .catch((err) => {
        console.error('Error fetching experience data:', err);
        setData([]); // fail-safe to avoid spinner loop
      });
  }, []);

  return (
    <>
      <Header title={header} />

      {data ? (
        <div className="section-content-container">
          <Container>
            <VerticalTimeline lineColor={theme?.timelineLineColor || '#1e40af'}>
              {data.map((item) => {
                const elementKey = `${item.title}-${item.dateText}`;
                return (
                  <Fade key={`fade-${elementKey}`}>
                    <VerticalTimelineElement
                      key={`vte-${elementKey}`}
                      date={item.dateText}
                      style={{ margin: '28px 0' }}
                      contentStyle={{
                        background: theme?.cardBackground || '#fff',
                        color: theme?.color || '#121212',
                        boxShadow: theme?.cardBackground
                          ? '0 6px 18px rgba(0,0,0,0.45)'
                          : '0 6px 18px rgba(0,0,0,0.08)',
                        border: `1px solid ${theme?.cardBorderColor || '#00000020'}`,
                        borderRadius: 10,
                        paddingBottom: '18px 20px',
                      }}
                      contentArrowStyle={{ borderRight: `7px solid ${theme?.cardBackground || '#fff'}` }}
                      iconStyle={{
                        background: theme?.accentColor || '#3D84C6',
                        color: '#fff',
                        boxShadow: theme?.background === '#121212'
                          ? '0 0 0 3px rgba(61, 132, 198, 0.22)'
                          : '0 0 0 3px rgba(61, 132, 198, 0.15)',
                        width: 52,
                        height: 52,
                      }}
                    >
                      <h2 className="item-title" style={styles.itemTitle}>
                        {item.title}
                      </h2>

                      <div style={styles.subtitleContainerStyle}>
                        <h4 style={{ ...styles.subtitleStyle, color: theme?.accentColor || '#1e40af' }}>
                          {item.subtitle}
                        </h4>
                        {item.workType && (
                          <h5 style={styles.inlineChild}>
                            &nbsp;·
                            {item.workType}
                          </h5>
                        )}
                      </div>

                      <ul style={styles.ulStyle} className="experience-points">
                        {item.workDescription?.map((point) => (
                          <li key={makePointKey(elementKey, point)}>
                            <ReactMarkdown
                              children={point}
                              components={{ p: 'span' }}
                            />
                          </li>
                        ))}
                      </ul>
                    </VerticalTimelineElement>
                  </Fade>
                );
              })}
            </VerticalTimeline>
          </Container>
        </div>
      ) : (
        <FallbackSpinner />
      )}
    </>
  );
}

Experience.propTypes = {
  header: PropTypes.string.isRequired,
};

export default Experience;
