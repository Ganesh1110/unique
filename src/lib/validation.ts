type SafeParseResult<T> =
  | { success: true; data: T }
  | { success: false; error: { errors: Array<{ message: string }> } };

function createError(message: string): SafeParseResult<never> {
  return { success: false, error: { errors: [{ message }] } };
}

export const checkoutSchema = {
  safeParse(data: any): SafeParseResult<{
    cartId: string;
    customerName?: string;
    customerEmail?: string;
    customerPhone?: string;
    address?: { addressLine?: string; city?: string; state?: string; pincode?: string };
    createAccount?: boolean;
    password?: string;
  }> {
    if (!data || typeof data !== 'object') return createError('Invalid request body');
    if (!data.cartId || typeof data.cartId !== 'string') return createError('Cart ID is required');
    if (data.customerEmail && typeof data.customerEmail === 'string' && data.customerEmail.length > 0) {
      if (!/\S+@\S+\.\S+/.test(data.customerEmail)) return createError('Invalid email address');
    }
    if (data.createAccount && data.password && typeof data.password === 'string' && data.password.length < 6) {
      return createError('Password must be at least 6 characters');
    }
    return {
      success: true,
      data: {
        cartId: String(data.cartId),
        customerName: data.customerName ? String(data.customerName) : undefined,
        customerEmail: data.customerEmail ? String(data.customerEmail) : undefined,
        customerPhone: data.customerPhone ? String(data.customerPhone) : undefined,
        address: data.address && typeof data.address === 'object' ? data.address : undefined,
        createAccount: Boolean(data.createAccount),
        password: data.password ? String(data.password) : undefined,
      },
    };
  },
};

export const loginSchema = {
  safeParse(data: any): SafeParseResult<{ email: string; password: string }> {
    if (!data || typeof data !== 'object') return createError('Invalid request body');
    if (!data.email || typeof data.email !== 'string' || !/\S+@\S+\.\S+/.test(data.email)) {
      return createError('Valid email is required');
    }
    if (!data.password || typeof data.password !== 'string') {
      return createError('Password is required');
    }
    return { success: true, data: { email: data.email, password: data.password } };
  },
};

export const reviewSchema = {
  safeParse(data: any): SafeParseResult<{
    rating: number;
    authorName: string;
    authorEmail: string;
    title?: string;
    comment: string;
  }> {
    if (!data || typeof data !== 'object') return createError('Invalid review data');
    const rating = Number(data.rating);
    if (Number.isNaN(rating) || rating < 1 || rating > 5) return createError('Rating must be between 1 and 5');
    if (!data.authorName || typeof data.authorName !== 'string' || data.authorName.trim().length < 2) {
      return createError('Name must be at least 2 characters');
    }
    if (!data.authorEmail || typeof data.authorEmail !== 'string' || !/\S+@\S+\.\S+/.test(data.authorEmail)) {
      return createError('Valid email is required');
    }
    if (!data.comment || typeof data.comment !== 'string' || data.comment.trim().length < 5) {
      return createError('Review comment must be at least 5 characters');
    }
    return {
      success: true,
      data: {
        rating,
        authorName: data.authorName.trim(),
        authorEmail: data.authorEmail.trim(),
        title: data.title ? String(data.title).trim() : undefined,
        comment: data.comment.trim(),
      },
    };
  },
};

export const blogArticleSchema = {
  safeParse(data: any): SafeParseResult<{
    title: string;
    handle: string;
    excerpt?: string;
    contentHtml: string;
    image?: string;
    author?: string;
  }> {
    if (!data || typeof data !== 'object') return createError('Invalid article data');
    if (!data.title || typeof data.title !== 'string' || data.title.trim().length < 3) {
      return createError('Title must be at least 3 characters');
    }
    if (!data.handle || typeof data.handle !== 'string' || data.handle.trim().length < 3) {
      return createError('Handle is required');
    }
    if (!data.contentHtml || typeof data.contentHtml !== 'string' || data.contentHtml.trim().length < 10) {
      return createError('Content must be at least 10 characters');
    }
    return {
      success: true,
      data: {
        title: data.title.trim(),
        handle: data.handle.trim(),
        excerpt: data.excerpt ? String(data.excerpt).trim() : undefined,
        contentHtml: data.contentHtml.trim(),
        image: data.image ? String(data.image).trim() : undefined,
        author: data.author ? String(data.author).trim() : undefined,
      },
    };
  },
};
