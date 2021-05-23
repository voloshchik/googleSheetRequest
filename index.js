const express = require('express')

const { google } = require('googleapis')

const PORT = 8080
const app = express()

app.use(express.static(__dirname + '/node_modules/bootstrap/dist'))
app.set('view engine', 'ejs')

app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
  res.render('index')
})

app.post('/', async (req, res) => {
  const { email, password } = req.body
  console.log('email', email)
  const auth = new google.auth.GoogleAuth({
    keyFile: 'credentials.json',
    scopes: 'https://www.googleapis.com/auth/spreadsheets',
  })

  // Create client instance for auth
  const client = await auth.getClient()

  const googleSheets = google.sheets({ version: 'v4', auth: client })

  const spreadsheetId = '1OIXefG7kY8Jw9Qd0pqcnQRwZgy675iZ-bXAuMgeuCSQ'

  // Get metadata about spreadsheet
  const metaData = await googleSheets.spreadsheets.get({
    auth,
    spreadsheetId,
  })

  const getRows = await googleSheets.spreadsheets.values.get({
    auth,
    spreadsheetId,
    range: 'sheet1!A:A',
  })

  await googleSheets.spreadsheets.values.append({
    auth,
    spreadsheetId,
    range: 'Sheet1!A:B',
    valueInputOption: 'USER_ENTERED',
    resource: {
      values: [[email, password]],
    },
  })
  res.redirect('/')
})

app.listen(PORT, () => {
  console.log(`Server has been started on ${PORT}`)
})
