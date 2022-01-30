const { SlashCommand, CommandOptionType, ComponentType } = require('slash-create')
const config = require('../config.js')

class Command extends SlashCommand {
  constructor (creator, client, qm, s) {
    super(creator, {
      name: 'search',
      description: 'Searches songs and adds them to queue.',
      options: [
        {
          type: CommandOptionType.STRING,
          choices: [
            {
              name: 'YouTube',
              value: 'yt'
            },
            {
              name: 'SoundCloud',
              value: 'sc'
            }
          ],
          name: 'service',
          description: 'Service to search in.',
          required: true
        },
        {
          type: CommandOptionType.STRING,
          name: 'query',
          description: 'Query to search.',
          required: true
        }
      ],
      guildIDs: config.mode === 'dev' ? config.debugGuilds : null
    })

    this.eris = client
    this.qm = qm
    this.s = s
  }

  async run (ctx) {
    const service = ctx.options.service
    const query = ctx.options.query

    const results = await this.s.search(service, query)
    const compiledResults = []

    for (const result of results) {
      compiledResults.push({
        value: String(results.indexOf(result)),
        label: result.name,
        description: result.artist
      })
    }

    await ctx.send('Select a result:', {
      components: [
        {
          components: [
            {
              type: ComponentType.SELECT,
              custom_id: 'search',
              options: compiledResults
            }
          ],
          type: ComponentType.ACTION_ROW
        }
      ]
    })
    this.qm.searchData[ctx.guildID] = { results }
  }
}

module.exports = Command
