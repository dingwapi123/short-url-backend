import app from "./app.js"

const port = 3000
await URLRecord.sync({ force: true })

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
  console.log(`Swagger UI available at http://localhost:${port}/v1/api-docs`)
})
