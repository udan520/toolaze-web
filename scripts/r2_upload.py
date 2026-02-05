"""
上传图片到 Cloudflare R2，并返回公网 URL 供 Kie AI 使用。
凭证请通过环境变量配置，勿提交到 Git。
上传时使用 UUID 作为文件名，增加隐私性（避免第三方从 URL 猜出业务逻辑）。

环境变量:
  R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_ENDPOINT_URL, R2_PUBLIC_BASE_URL
  R2_BUCKET（可选，默认 toolaze）
"""
import os
import uuid
from typing import Optional
import boto3
from botocore.config import Config

# 凭证仅从环境变量读取，勿在代码里写真实密钥
access_key = os.environ.get("R2_ACCESS_KEY_ID")
secret_key = os.environ.get("R2_SECRET_ACCESS_KEY")
endpoint_url = os.environ.get("R2_ENDPOINT_URL")
bucket_name = os.environ.get("R2_BUCKET", "toolaze")
public_base_url = (os.environ.get("R2_PUBLIC_BASE_URL") or "").rstrip("/")

if not all([access_key, secret_key, endpoint_url, public_base_url]):
    raise RuntimeError(
        "请设置环境变量: R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_ENDPOINT_URL, R2_PUBLIC_BASE_URL"
    )

s3_client = boto3.client(
    service_name="s3",
    endpoint_url=endpoint_url,
    aws_access_key_id=access_key,
    aws_secret_access_key=secret_key,
    region_name="auto",
    config=Config(signature_version="s3v4"),
)


def _ext_from_path(path: str) -> str:
    p = path.lower()
    if p.endswith(".jpg") or p.endswith(".jpeg"):
        return "jpg"
    if p.endswith(".webp"):
        return "webp"
    return "png"


def upload_and_get_url(
    file_path: str,
    object_name: Optional[str] = None,
    content_type: str = "image/jpeg",
) -> Optional[str]:
    """
    上传图片到 R2 并返回匿名公网 URL。
    object_name 不传则用 UUID 随机生成，增加隐私性。
    """
    if not object_name:
        ext = _ext_from_path(file_path)
        object_name = f"{uuid.uuid4()}.{ext}"
    try:
        s3_client.upload_file(
            file_path,
            bucket_name,
            object_name,
            ExtraArgs={"ContentType": content_type},
        )
        return f"{public_base_url}/{object_name}"
    except Exception as e:
        print(f"上传失败: {e}")
        return None


if __name__ == "__main__":
    import sys
    path = sys.argv[1] if len(sys.argv) > 1 else "local_image.jpg"
    # 不传 object_name 时自动用 UUID 作为文件名
    name = sys.argv[2] if len(sys.argv) > 2 else None
    url = upload_and_get_url(path, name)
    if url:
        print(f"传给 KIE API 的地址是: {url}")
