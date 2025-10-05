// src/app/api/comments/route.ts
import { fetchAPI } from '@/lib/api';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { postId, author, authorEmail, content } = await request.json();

  // Basic validation
  if (!postId || !author || !authorEmail || !content) {
    return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
  }

  try {
    const data = await fetchAPI(
      `
      mutation CREATE_COMMENT($input: CreateCommentInput!) {
        createComment(input: $input) {
          success
          comment {
            id
          }
        }
      }
      `,
      {
        variables: {
          input: {
            commentOn: postId,
            author: author,
            authorEmail: authorEmail,
            content: content,
          }
        }
      }
    );

    if (data.createComment.success) {
      return NextResponse.json({ success: true, ...data.createComment });
    } else {
      // Handle GraphQL errors passed back from the API
      return NextResponse.json({ success: false, message: 'Failed to create comment.' }, { status: 500 });
    }

  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'An unexpected error occurred.' }, { status: 500 });
  }
}