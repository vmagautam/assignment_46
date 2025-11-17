import express from 'express'
import { createCompany, getCompanies, getCompany, updateCompany, deleteCompany } from '../controller/company/companyController.js'

const router = express.Router()

router.get('/', getCompanies)
router.get('/:id', getCompany)
router.post('/', createCompany)
router.put('/:id', updateCompany)
router.delete('/:id', deleteCompany)

export default router
