const metricsPaths = {
  '/api/metrics': {
    get: {
      summary: 'Get platform metrics',
      tags: ['Metrics'],
      responses: {
        200: {
          description: 'Platform metrics',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  mostPopularDay: { type: 'string' },
                  averages: {
                    type: 'object',
                    properties: {
                      questionsPerUser: { type: 'number' },
                      answersPerUser: { type: 'number' },
                      votesPerUser: { type: 'number' },
                    },
                  },
                  totals: {
                    type: 'object',
                    properties: {
                      questions: { type: 'number' },
                      answers: { type: 'number' },
                      votes: { type: 'number' },
                      users: { type: 'number' },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};

const answerPaths = {
  '/api/questions/{questionId}/answers': {
    get: {
      summary: 'Get all answers for a question',
      tags: ['Answers'],
      parameters: [
        {
          in: 'path',
          name: 'questionId',
          required: true,
          schema: { type: 'string' },
        },
      ],
      responses: {
        200: { description: 'List of answers' },
        404: { description: 'Question not found' },
      },
    },
    post: {
      summary: 'Create an answer',
      tags: ['Answers'],
      security: [{ openid: [] }],
      parameters: [
        {
          in: 'path',
          name: 'questionId',
          required: true,
          schema: { type: 'string' },
        },
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['content'],
              properties: {
                content: { type: 'string' },
              },
            },
          },
        },
      },
      responses: {
        200: { description: 'Answer created' },
        401: { description: 'Authentication required' },
      },
    },
  },
  '/api/questions/{questionId}/answers/{id}': {
    put: {
      summary: 'Update an answer',
      tags: ['Answers'],
      security: [{ openid: [] }],
      parameters: [
        {
          in: 'path',
          name: 'questionId',
          required: true,
          schema: { type: 'string' },
        },
        {
          in: 'path',
          name: 'id',
          required: true,
          schema: { type: 'string' },
        },
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['content'],
              properties: {
                content: { type: 'string' },
              },
            },
          },
        },
      },
      responses: {
        200: { description: 'Answer updated' },
        401: { description: 'Authentication required' },
        403: { description: 'Not authorized' },
      },
    },
    delete: {
      summary: 'Delete an answer',
      tags: ['Answers'],
      security: [{ openid: [] }],
      parameters: [
        {
          in: 'path',
          name: 'questionId',
          required: true,
          schema: { type: 'string' },
        },
        {
          in: 'path',
          name: 'id',
          required: true,
          schema: { type: 'string' },
        },
      ],
      responses: {
        200: { description: 'Answer deleted' },
        401: { description: 'Authentication required' },
        403: { description: 'Not authorized' },
      },
    },
  },
};

const questionPaths = {
  '/api/questions': {
    get: {
      summary: 'Get all questions',
      tags: ['Questions'],
      parameters: [
        {
          in: 'query',
          name: 'page',
          schema: { type: 'integer', default: 1 },
        },
        {
          in: 'query',
          name: 'limit',
          schema: { type: 'integer', default: 10 },
        },
        {
          in: 'query',
          name: 'sortBy',
          schema: {
            type: 'string',
            enum: ['newest', 'popular'],
            default: 'popular',
          },
        },
      ],
      responses: {
        200: { description: 'List of questions with pagination' },
        500: { description: 'Server error' },
      },
    },
    post: {
      summary: 'Create new question',
      tags: ['Questions'],
      security: [{ openid: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['title', 'content'],
              properties: {
                title: { type: 'string' },
                content: { type: 'string' },
              },
            },
          },
        },
      },
      responses: {
        200: { description: 'Question created' },
        401: { description: 'Authentication required' },
        500: { description: 'Server error' },
      },
    },
  },
  '/api/questions/{id}': {
    get: {
      summary: 'Get question by ID',
      tags: ['Questions'],
      parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
      responses: {
        200: { description: 'Question details' },
        404: { description: 'Question not found' },
      },
    },
    put: {
      summary: 'Update question',
      tags: ['Questions'],
      security: [{ openid: [] }],
      parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                title: { type: 'string' },
                content: { type: 'string' },
              },
            },
          },
        },
      },
      responses: {
        200: { description: 'Question updated' },
        401: { description: 'Authentication required' },
        403: { description: 'Not authorized' },
      },
    },
    delete: {
      summary: 'Delete question',
      tags: ['Questions'],
      security: [{ openid: [] }],
      parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
      responses: {
        200: { description: 'Question deleted' },
        401: { description: 'Authentication required' },
        403: { description: 'Not authorized' },
      },
    },
  },
};

const userPaths = {
  '/api/users/profile': {
    get: {
      summary: 'Get user profile',
      tags: ['User'],
      security: [{ openid: [] }],
      responses: {
        200: { description: 'User profile information' },
        401: { description: 'Unauthorized' },
      },
    },
  },
};

const votePaths = {
  '/api/votes': {
    post: {
      summary: 'Create or update vote',
      tags: ['Votes'],
      security: [{ openid: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['value'],
              properties: {
                value: { type: 'number', enum: [1, -1] },
                questionId: { type: 'string' },
                answerId: { type: 'string' },
              },
            },
          },
        },
      },
      responses: {
        200: { description: 'Vote created/updated' },
        400: { description: 'Invalid input' },
        401: { description: 'Unauthorized' },
      },
    },
  },
  '/api/votes/{id}': {
    delete: {
      summary: 'Delete vote',
      tags: ['Votes'],
      security: [{ openid: [] }],
      parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
      responses: {
        200: { description: 'Vote deleted' },
        401: { description: 'Unauthorized' },
        403: { description: 'Forbidden' },
      },
    },
  },
  '/api/votes/user': {
    get: {
      summary: "Get user's vote for question/answer",
      tags: ['Votes'],
      security: [{ openid: [] }],
      parameters: [
        { in: 'query', name: 'questionId', schema: { type: 'string' } },
        { in: 'query', name: 'answerId', schema: { type: 'string' } },
      ],
      responses: {
        200: { description: "User's vote" },
        401: { description: 'Unauthorized' },
      },
    },
  },
};

const swaggerPaths = {
  ...metricsPaths,
  ...answerPaths,
  ...questionPaths,
  ...userPaths,
  ...votePaths,
};

export default swaggerPaths;
