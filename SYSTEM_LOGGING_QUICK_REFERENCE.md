# System Logging - Quick Reference

## TL;DR

System logging is now fully implemented and integrated:
- ✅ Logs saved to `SystemLog` table (Prisma)
- ✅ Health checks logged automatically
- ✅ Paginated logs API with filters
- ✅ SUPERADMIN-only access
- ✅ TypeScript validated

---

## Quick Usage

### Log an Action

```typescript
import { logSystemAction } from "@/lib/logger";

await logSystemAction({
  action: "ORDER_PLACED",
  message: "New order created",
  level: "INFO",
  metadata: { orderId: "ord_123", total: 5000 },
});
```

### Fetch Logs (API)

```bash
# Get first 50 logs
curl http://localhost:3000/api/admin/system/logs

# With pagination & filters
curl "http://localhost:3000/api/admin/system/logs?page=2&limit=20&level=ERROR"
```

---

## Files Created

| File | Purpose |
|------|---------|
| `src/lib/logger.ts` | Core logging utility |
| `src/app/api/health/route.ts` | Health check with logging |
| `src/app/api/admin/system/logs/route.ts` | Logs API (paginated) |
| `SYSTEM_LOGGING_GUIDE.md` | Full documentation |

---

## Log Levels

```
INFO     → Normal operations (default)
WARN     → Warning conditions
ERROR    → Error conditions
CRITICAL → Critical failures
```

---

## API: GET /api/admin/system/logs

**Auth**: SUPERADMIN only

**Query Params**:
- `page` (default: 1)
- `limit` (default: 50, max: 100)
- `level` (INFO|WARN|ERROR|CRITICAL)
- `action` (string, partial match)

**Response**:
```json
{
  "logs": [...],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 250,
    "totalPages": 5,
    "hasMore": true
  }
}
```

---

## Git Commits

```
6c3eade feat: add system logging to health check endpoint
aa200f2 feat: enhance system logs API with pagination and filtering
```

---

## Build Status

✅ **Compiles successfully**  
✅ **TypeScript validated**  
✅ **Ready for production**

---

## Next Steps

1. Integrate logging into more API routes
2. Create admin dashboard for log viewing
3. Set up alerts for ERROR/CRITICAL logs
4. Implement log retention/archival policy

