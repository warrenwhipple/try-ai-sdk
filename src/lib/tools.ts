import { tool } from 'ai'
import { z } from 'zod'

export const appendSchema = z.object({
  item: z.string().describe('The item to add to the list'),
})

export const appendTool = tool({
  description: 'Add an item to the document list',
  parameters: appendSchema,
  execute: async ({ item }) => {
    // Return the item to be added - client will handle the actual store update
    return { action: 'addItem', value: item }
  },
})
