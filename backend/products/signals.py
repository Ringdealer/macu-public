from django.db.models.signals import pre_save, post_save  # new
from django.dispatch import receiver  # new
from .models import Product, StockMovement  # new


@receiver(pre_save, sender=Product)
def capture_old_stock(sender, instance, **kwargs):  # new
    """
    Store previous stock before update
    """
    if instance.pk:
        try:
            old = Product.objects.get(pk=instance.pk)
            instance._old_stock = old.stock  # new
        except Product.DoesNotExist:
            instance._old_stock = None  # new


@receiver(post_save, sender=Product)
def create_stock_movement(sender, instance, created, **kwargs):  # new
    """
    Create stock history record when stock changes
    """
    if created:
        return

    old_stock = getattr(instance, "_old_stock", None)

    if old_stock is None:
        return

    if old_stock != instance.stock:
        StockMovement.objects.create(
            product=instance,
            old_stock=old_stock,
            new_stock=instance.stock,
            change=instance.stock - old_stock,
            reason="Ajuste manual",  # can improve later
        )