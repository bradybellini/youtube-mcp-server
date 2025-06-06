import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { VideoService } from './services/video';
import { TranscriptService } from './services/transcript';
import { PlaylistService } from './services/playlist';
import { ChannelService } from './services/channel';

export async function startMcpServer() {
    // Create MCP server
    const server = new McpServer({
        name: 'YouTube MCP Server',
        version: '1.0.0',
    }, {
        capabilities: {
            tools: {},
        },
        instructions: 'MCP Server for interacting with YouTube content and services',
    });

    // Create service instances - they won't initialize APIs until methods are called
    const videoService = new VideoService();
    const transcriptService = new TranscriptService();
    const playlistService = new PlaylistService();
    const channelService = new ChannelService();


    
    // Register video tools
    server.tool('videos_getVideo', 'Get detailed information about a YouTube video', {
        videoId: z.string().describe('The YouTube video ID'),
        parts: z.array(z.string()).optional().describe('Parts of the video to retrieve'),
    }, async (params) => {
        try {
            const result = await videoService.getVideo(params as any);
            return {
                content: [{
                    type: 'text',
                    text: JSON.stringify(result, null, 2)
                }]
            };
        } catch (error) {
            return {
                content: [{
                    type: 'text',
                    text: `Error: ${error instanceof Error ? error.message : String(error)}`
                }],
                isError: true
            };
        }
    });

    server.tool('videos_searchVideos', 'Search for videos on YouTube', {
        query: z.string().describe('Search query'),
        maxResults: z.number().optional().describe('Maximum number of results to return'),
    }, async (params) => {
        try {
            const result = await videoService.searchVideos(params as any);
            return {
                content: [{
                    type: 'text',
                    text: JSON.stringify(result, null, 2)
                }]
            };
        } catch (error) {
            return {
                content: [{
                    type: 'text',
                    text: `Error: ${error instanceof Error ? error.message : String(error)}`
                }],
                isError: true
            };
        }
    });

    server.tool('transcripts_getTranscript', 'Get the transcript of a YouTube video', {
        videoId: z.string().describe('The YouTube video ID'),
        language: z.string().optional().describe('Language code for the transcript'),
    }, async (params) => {
        try {
            const result = await transcriptService.getTranscript(params as any);
            return {
                content: [{
                    type: 'text',
                    text: JSON.stringify(result, null, 2)
                }]
            };
        } catch (error) {
            return {
                content: [{
                    type: 'text',
                    text: `Error: ${error instanceof Error ? error.message : String(error)}`
                }],
                isError: true
            };
        }
    });

    server.tool('channels_getChannel', 'Get information about a YouTube channel', {
        channelId: z.string().describe('The YouTube channel ID'),
    }, async (params) => {
        try {
            const result = await channelService.getChannel(params as any);
            return {
                content: [{
                    type: 'text',
                    text: JSON.stringify(result, null, 2)
                }]
            };
        } catch (error) {
            return {
                content: [{
                    type: 'text',
                    text: `Error: ${error instanceof Error ? error.message : String(error)}`
                }],
                isError: true
            };
        }
    });

    server.tool('channels_listVideos', 'Get videos from a specific channel', {
        channelId: z.string().describe('The YouTube channel ID'),
        maxResults: z.number().optional().describe('Maximum number of results to return'),
    }, async (params) => {
        try {
            const result = await channelService.listVideos(params as any);
            return {
                content: [{
                    type: 'text',
                    text: JSON.stringify(result, null, 2)
                }]
            };
        } catch (error) {
            return {
                content: [{
                    type: 'text',
                    text: `Error: ${error instanceof Error ? error.message : String(error)}`
                }],
                isError: true
            };
        }
    });

    server.tool('playlists_getPlaylist', 'Get information about a YouTube playlist', {
        playlistId: z.string().describe('The YouTube playlist ID'),
    }, async (params) => {
        try {
            const result = await playlistService.getPlaylist(params as any);
            return {
                content: [{
                    type: 'text',
                    text: JSON.stringify(result, null, 2)
                }]
            };
        } catch (error) {
            return {
                content: [{
                    type: 'text',
                    text: `Error: ${error instanceof Error ? error.message : String(error)}`
                }],
                isError: true
            };
        }
    });

    server.tool('playlists_getPlaylistItems', 'Get videos in a YouTube playlist', {
        playlistId: z.string().describe('The YouTube playlist ID'),
        maxResults: z.number().optional().describe('Maximum number of results to return'),
    }, async (params) => {
        try {
            const result = await playlistService.getPlaylistItems(params as any);
            return {
                content: [{
                    type: 'text',
                    text: JSON.stringify(result, null, 2)
                }]
            };
        } catch (error) {
            return {
                content: [{
                    type: 'text',
                    text: `Error: ${error instanceof Error ? error.message : String(error)}`
                }],
                isError: true
            };
        }
    });



    // Create transport and connect
    const transport = new StdioServerTransport();
    await server.connect(transport);
    
    // Log the server info
    console.log(`YouTube MCP Server v1.0.0 started successfully`);
    console.log(`Server will validate YouTube API key when tools are called`);
    
    return server;
}
