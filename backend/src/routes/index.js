import express from 'express'
import clientRoutes from './clientRoutes.js'
import clientGSTRoutes from './clientGSTRoutes.js'
import currencyRoutes from './currencyRoutes.js'
import businessEntityRoutes from './businessEntityRoutes.js'
import statesRoutes from './statesRoutes.js'
import gstinRoutes from './gstinRoutes.js'
const router = express.Router()

router.use('/client', clientRoutes)
router.use('/client/gst', clientGSTRoutes)
router.use('/currency', currencyRoutes)
router.use('/business-entity', businessEntityRoutes)
router.use('/states', statesRoutes)
router.use('/gstin', gstinRoutes)
export default router