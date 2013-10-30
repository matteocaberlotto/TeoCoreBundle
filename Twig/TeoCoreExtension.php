<?php

namespace Teo\CoreBundle\Twig;

class TeoCoreExtension extends \Twig_Extension
{
    protected $container;

    public function __construct($container)
    {
        $this->container = $container;
    }

    public function getGlobals()
    {
        return array(
            'website' => $this->container->getParameter('teo_core.website')
        );
    }

    public function getFilters()
    {
        return array(
            new \Twig_SimpleFilter('md5Sum', array($this, 'md5SumFilter')),
        );
    }

    public function md5SumFilter($string)
    {
        return md5($string);
    }

    public function getName()
    {
        return 'teocore_extension';
    }
}