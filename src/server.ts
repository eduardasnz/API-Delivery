import { env } from "process"
import { app } from "./app"

const PORT = env.PORT

app.listen(PORT, () => console.log(`Server Running on port ${PORT}!`))