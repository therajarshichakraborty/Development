import { Elysia } from 'elysia'
import { z } from 'zod'
import * as v from 'valibot'

const app = new Elysia()
	.get('/id/:id', () => {
		console.log("test")
	}, {
		query: v.object({
			name: v.literal('Lilith')
		})
	})		

app.listen(3000)

export default app;