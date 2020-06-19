import React from 'react'

import { useTranslation } from 'react-i18next'
import { Col, Container, Row } from 'reactstrap'

import { getVersionString } from '../../helpers/getVersionString'

import './Footer.scss'

export default function Footer() {
  const { t } = useTranslation()

  return (
    <Container fluid className="py-3">
      <Row noGutters>
        <Col xs={12} md={6} className="text-center text-md-left mb-2 mb-md-0">
          <h6>Outbreak Explorer builds on the <a href="http://covid19-scenarios.org" target='_blank'>COVID-19 Scenarios</a> project led by the <a href="http://https://neherlab.org" target='_blank'>neherlab</a></h6>
        </Col>
        <Col xs={12} md={6} className="d-flex justify-content-center justify-content-md-end align-items-center">
          <small className="text-gray-light">{getVersionString()}</small>
        </Col>
      </Row>
    </Container>
  )
}
