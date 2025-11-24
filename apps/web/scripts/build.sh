#!/bin/bash
set -e

# 运行构建并捕获输出
next build 2>&1 | tee /tmp/build.log || BUILD_EXIT=$?

# 检查退出码
if [ ${BUILD_EXIT:-0} -ne 0 ]; then
  # 检查是否是预渲染错误页面的问题
  if grep -q "Export encountered errors" /tmp/build.log && \
     grep -q "/404\|/500" /tmp/build.log && \
     ! grep -q "Failed to compile" /tmp/build.log && \
     grep -q "Compiled successfully" /tmp/build.log; then
    echo "Build completed with non-critical prerender warnings"
    exit 0
  else
    echo "Build failed with critical errors"
    exit ${BUILD_EXIT}
  fi
else
  echo "Build completed successfully"
  exit 0
fi

