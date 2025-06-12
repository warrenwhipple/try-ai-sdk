import { tool } from 'ai'
import { z } from 'zod'

export const addItemSchema = z.object({
  item: z.string().describe('The item to add to the list'),
})

export const addItemTool = tool({
  description: 'Add an item to the document list',
  parameters: addItemSchema,
})
