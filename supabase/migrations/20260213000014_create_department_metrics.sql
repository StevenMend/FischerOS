-- ============================================
-- 014: DEPARTMENT METRICS (aggregated stats)
-- ============================================

CREATE TABLE IF NOT EXISTS public.department_metrics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  department_id UUID NOT NULL REFERENCES public.departments(id) ON DELETE CASCADE,
  metric_date DATE NOT NULL,

  -- Request metrics
  total_requests INTEGER DEFAULT 0,
  completed_requests INTEGER DEFAULT 0,
  avg_response_time_minutes DECIMAL(10,2),
  avg_completion_time_minutes DECIMAL(10,2),
  avg_rating DECIMAL(3,2),

  -- Staff metrics
  active_staff INTEGER DEFAULT 0,

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(property_id, department_id, metric_date)
);

CREATE INDEX IF NOT EXISTS idx_dept_metrics_property ON public.department_metrics(property_id);
CREATE INDEX IF NOT EXISTS idx_dept_metrics_department ON public.department_metrics(department_id);
CREATE INDEX IF NOT EXISTS idx_dept_metrics_date ON public.department_metrics(metric_date);
